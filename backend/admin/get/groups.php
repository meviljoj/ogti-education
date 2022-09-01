<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require __DIR__ . '/../../classes/Database.php';
require __DIR__ . '/../../AuthMiddleware.php';

$db_connection = new Database();
$conn = $db_connection->dbConnection();
$data = json_decode(file_get_contents("php://input"));

$allHeaders = getallheaders();
$auth = new Auth($conn, $allHeaders);
$course_code = trim($data->course_code);
$user_data = ($auth->isValid());

if ($user_data['user']['role'] == 'admin') {
    $only_all_groups_query = $conn->prepare("SELECT * FROM `students_groups` ORDER BY `code` ASC");
    $only_all_groups_query->execute();
    $only_all_groups = $only_all_groups_query->fetchAll();
    $only_all_groups_length = count($only_all_groups);
    $groups_output = [];

    for ($i = 0; $i < $only_all_groups_length; $i++) {
        $course_access_query = $conn->prepare("SELECT * FROM `courses_access` WHERE `groups_code` = :groups_code");
        $course_access_query->bindValue(':groups_code', $only_all_groups[$i]['code']);
        $course_access_query->execute();
        $group_elements = [];

        if ($course_access_query->rowCount() == 0) {

            $group_elements['code'] = $only_all_groups[$i]['code'];
            $group_elements['name'] = $only_all_groups[$i]['organization_name'];
            $group_elements['address'] = $only_all_groups[$i]['address'];
            $group_elements['start_date'] = $only_all_groups[$i]['start_date'];
            $group_elements['end_date'] = $only_all_groups[$i]['end_date'];
            $group_elements['education_name'] = 'Отсутсвует';
            $group_elements['students'] = [];
            $groups_output[] = $group_elements;
        } else {
            $group_query = $conn->prepare("SELECT *, `students_groups`.`code` AS `group_code` FROM `students_groups`, `courses_access`, `courses` WHERE `students_groups`.`code` = :group_code AND `students_groups`.`code` = `courses_access`.`groups_code` AND `courses_access`.`courses_code` = `courses`.`code`");
            $group_query->bindValue(':group_code', $only_all_groups[$i]['code']);
            $group_query->execute();
            $group = $group_query->fetch();

            $group_elements['code'] = $group['group_code'];
            $group_elements['name'] = $group['organization_name'];
            $group_elements['address'] = $group['address'];
            $group_elements['education_name'] = $group['name'];
            $group_elements['start_date'] = $group['start_date'];
            $group_elements['end_date'] = $group['end_date'];

            $students_group_query = $conn->prepare("SELECT * FROM `students` WHERE `group_code` = :group_code");
            $students_group_query->bindValue(':group_code', $only_all_groups[$i]['code']);
            $students_group_query->execute();
            $students_group = $students_group_query->fetchAll();
            $student_length = count($students_group);
            $students = [];

            for ($j = 0; $j < $student_length; $j++) {
                $student = [];
                $student['code'] = $students_group[$j]['code'];
                $student['full_name'] = $students_group[$j]['full_name'];
                $student['email'] = $students_group[$j]['email'];

                $student_progress = [];
                $student_progress_element = [];
                $all_article_query = $conn->prepare("SELECT `article`.`code` FROM `article`, `chapters`, `courses_structure` WHERE `article`.`chapter_code` = `chapters`.`code` AND `chapters`.`code` = `courses_structure`.`chapter_code` AND `courses_structure`.`course_code` = :course_code");
                $all_article_query->bindValue(':course_code', $group['courses_code']);
                $all_article_query->execute();
                $all_article = $all_article_query->fetchAll();
                $all_article_length = count($all_article);
                $completed_articles = [];

                for ($l = 0; $l < $all_article_length; $l++) {
                    $completed_article = [];
                    $completed_article_query = $conn->prepare("SELECT `code` FROM `student_article_progress` WHERE `student_code` = :student_code AND `article_code` = :article_code");
                    $completed_article_query->bindValue(':student_code', $students_group[$j]['code']);
                    $completed_article_query->bindValue(':article_code', $all_article[$l]['code']);
                    $completed_article_query->execute();
                    $completed_article = $completed_article_query->fetchAll();
                    if ($completed_article[0]['code'] != []) $completed_articles[] = $completed_article[0]['code'];
                }

                $article_percentage = count($completed_articles) / $all_article_length * 100;
                $student_progress_element['name'] = "Параграфы обучения";
                $student_progress_element['completed'] = $article_percentage . " %";
                $student_progress[] = $student_progress_element;

                $all_tests_query = $conn->prepare("SELECT * FROM `tests`, `tests_time` WHERE `tests_time`.`group_code` = :group_code AND `tests`.`code` = `tests_time`.`test_code`");
                $all_tests_query->bindValue(':group_code', $only_all_groups[$i]['code']);
                $all_tests_query->execute();
                $all_tests = $all_tests_query->fetchAll();

                for ($l = 0; $l < count($all_tests); $l++) {
                    $test_query = $conn->prepare("SELECT * FROM `student_test_progress`, `tests` WHERE `student_test_progress`.`student_code` = :student_code AND `tests`.`code` = `student_test_progress`.`test_code` AND `tests`.`code` = :test_code");
                    $test_query->bindValue(':test_code', $all_tests[$l]['test_code']);
                    $test_query->bindValue(':student_code', $students_group[$j]['code']);
                    $test_query->execute();
                    $test_progress= $test_query->fetchAll();
                    $student_progress_element = [];

                    if ($test_progress == []) {
                        $student_progress_element['name'] = $all_tests[$l]['name'];
                        $student_progress_element['completed'] = "Не завершён";
                        $student_progress[] = $student_progress_element;
                    } else {
                        $student_progress_element['name'] = $all_tests[$l]['name'];
                        if ($test_progress[$l]['test_passed'] == null) {
                            $student_progress_element['completed'] = "Не завершён";
                        } else if ($test_progress[$l]['test_passed'] == "1") {
                            $student_progress_element['completed'] = "Сдан";
                        } else {
                            $student_progress_element['completed'] = "Завален";
                        }
                        $student_progress[] = $student_progress_element;
                    }
                }
                $student['progress'] = $student_progress;
                $students[] = $student;
            }
            $group_elements['students'] = $students;
            $groups_output[] = $group_elements;
        }
    }
    echo json_encode($groups_output, JSON_UNESCAPED_UNICODE);
} else {
    echo "Access Denied!";
}