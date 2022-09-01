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
$group_code = trim($data->group_code);
$user_data = ($auth->isValid());

if ($user_data['user']['role'] == 'admin') {
    $group_values = [];
    $students_values = [];
    $tests_time = [];
    if ($group_code == null) {
        $group_values['code'] = null;
        $group_values['name'] = '';
        $group_values['input_name'] = '';
        $group_values['address'] = '';
        $group_values['study_program'] = '';
        $group_values['start_date'] = null;
        $group_values['end_date'] = null;
    } else {
        $group_values_query = $conn->prepare("SELECT *, `students_groups`.`code` AS `group_code`, `courses`.`code` AS `course_code` FROM `students_groups`, `courses_access`, `courses` WHERE `students_groups`.`code` = :group_code AND `students_groups`.`code` = `courses_access`.`groups_code` AND `courses_access`.`courses_code` = `courses`.`code`");
        $group_values_query->bindValue(':group_code', $group_code);
        $group_values_query->execute();
        $group_values_prepare = $group_values_query->fetch();
        $study_program = $group_values_prepare['course_code'];

        if ($group_values_prepare == []) {
            $group_values_query = $conn->prepare("SELECT * FROM `students_groups` WHERE `code` = :group_code");
            $group_values_query->bindValue(':group_code', $group_code);
            $group_values_query->execute();
            $group_values_prepare = $group_values_query->fetch();
            $study_program = '';
        }

        $group_values['code'] = $group_values_prepare['group_code'];
        $group_values['name'] = $group_values_prepare['organization_name'];
        $group_values['input_name'] = $group_values_prepare['organization_name'];
        $group_values['address'] = $group_values_prepare['address'];
        $group_values['study_program'] = $study_program;
        $group_values['start_date'] = $group_values_prepare['start_date'];
        $group_values['end_date'] = $group_values_prepare['end_date'];

        $group_students_query = $conn->prepare("SELECT * FROM `students` WHERE `group_code` = :group_code");
        $group_students_query->bindValue(':group_code', $group_code);
        $group_students_query->execute();
        $group_students = $group_students_query->fetchAll();

        for ($i = 0; $i < count($group_students); $i++) {
            $student = [];
            $student['code'] = $group_students[$i]['code'];
            $student['name'] = $group_students[$i]['full_name'];
            $student['email'] = $group_students[$i]['email'];
            $students_values[] = $student;
        }

        $all_course_tests_query = $conn->prepare("SELECT `test_code` FROM `courses_structure` WHERE `course_code` = :course_code AND `test_code` IS NOT NULL");
        $all_course_tests_query->bindValue(':course_code', $study_program);
        $all_course_tests_query->execute();
        $all_course_tests = $all_course_tests_query->fetchAll();

        for ($i = 0; $i < count($all_course_tests); $i++) {

            $test_time = [];

            $tests_time_query = $conn->prepare("SELECT * FROM `tests`, `tests_time`, `students_groups` WHERE `students_groups`.`code` = :group_code AND `tests`.`code` = :test_code AND `tests`.`code` = `tests_time`.`test_code` AND `students_groups`.`code` = `tests_time`.`group_code`");
            $tests_time_query->bindValue(':group_code', $group_code);
            $tests_time_query->bindValue(':test_code', $all_course_tests[$i]['test_code']);
            $tests_time_query->execute();
            $tests_time_array = $tests_time_query->fetch();

            if ($tests_time_array == []) {
                $test_info_query = $conn->prepare("SELECT * FROM `tests` WHERE `code` = :test_code");
                $test_info_query->bindValue(':test_code', $all_course_tests[$i]['test_code']);
                $test_info_query->execute();
                $test_info = $test_info_query->fetch();
                $test_time['code'] = $test_info['code'];
                $test_time['test_name'] = $test_info['name'];
                $test_time['start_time'] = null;
                $test_time['end_time'] = null;
                $tests_time[] = $test_time;
            } else {
                $test_time['code'] = $tests_time_array['test_code'];
                $test_time['test_name'] = $tests_time_array['name'];
                $test_time['start_time'] = $tests_time_array['start_time'];
                $test_time['end_time'] = $tests_time_array['end_time'];
                $tests_time[] = $test_time;
            }
        }
    }

    $group_output = [];
    $group_output['group_values'] = $group_values;
    $group_output['students_values'] = $students_values;
    $group_output['tests_time'] = $tests_time;

    echo json_encode($group_output, JSON_UNESCAPED_UNICODE);
} else {
    echo "Access Denied!";
}