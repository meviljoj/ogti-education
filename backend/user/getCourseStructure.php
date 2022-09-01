<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST, GET");
header("Content-Type: application/json; charset=UTF-8; text/plain");
header("Access-Control-Allow-Headers: Origin, Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require __DIR__ . '/../classes/Database.php';
require __DIR__ . '/../AuthMiddleware.php';
$db_connection = new Database();
$conn = $db_connection->dbConnection();
$data = json_decode(file_get_contents("php://input"));
$allHeaders = getallheaders();
$auth = new Auth($conn, $allHeaders);
$course_code = trim($data->course_code);
$user_data = ($auth->isValid());

if ($user_data['user']['role'] == 'student') {
    $student_code = $user_data['user']['code'];
    $user_group = $user_data['user']['group_code'];
    $course_info_array = [];
    $course_info_query = $conn->prepare("SELECT `name`, `start_date`, `end_date` FROM `courses`, `students_groups` WHERE `courses`.`code` = :course_code AND `students_groups`.`code` = :user_group");
    $course_info_query->bindValue(':course_code', $course_code, PDO::PARAM_STR);
    $course_info_query->bindValue(':user_group', $user_group, PDO::PARAM_STR);
    $course_info_query->execute();
    $course_info = $course_info_query->fetch(PDO::FETCH_ASSOC);

    $start_date = $course_info['start_date'];
    $end_date = $course_info['end_date'];
    $array_days = [];
    $start_date_str = strtotime($start_date);
    $end_date_str = strtotime($end_date);
    $i = 0;

    for ($currentDate = $start_date_str; $currentDate <= $end_date_str; $currentDate += (86400)) {
        $Store = date('m.d', $currentDate);
        $array_days[] = $Store;
    }

    $current_date_str = strtotime(date('m/d/Y h:i:s a', time()));
    $seconds_to_access = $start_date_str - $current_date_str;
    $access_denied = true;
    $days_progress = 0;
    if ($seconds_to_access < 0) {
        $access_denied = false;
        $days_progress = 100 / (count($array_days) - 1) * abs($seconds_to_access) / 60 / 60 / 24;
        if ($days_progress > 100) $days_progress = 100;
    }

    $course_info_array['name'] = $course_info['name'];
    $course_info_array['access_denied'] = $access_denied;
    $course_info_array['seconds_to_access'] = $seconds_to_access;
    $course_info_array['study_days'] = $array_days;
    $course_info_array['days_progress'] = $days_progress;

    $tests_query = $conn->prepare("SELECT `tests`.*, `student_test_progress`.*, `courses_structure`.* FROM `tests` LEFT JOIN `student_test_progress` ON `student_test_progress`.`test_code` = `tests`.`code` LEFT JOIN `courses_structure` ON `courses_structure`.`test_code` = `tests`.`code` WHERE `student_test_progress`.`student_code` = :student_code");
    $tests_query->bindValue('student_code', $student_code);
    $tests_query->execute();
    $tests_array = $tests_query->fetchAll(PDO::FETCH_ASSOC);
    $tests_output = [];

    for ($i = 0; $i < count($tests_array); $i++) {
        $test_elements = [];
        $test_elements['element_sequence'] = $tests_array[$i]['sequence_number'];
        $test_elements['is_test'] = true;
        $test_elements['code'] = $tests_array[$i]['test_code'];
        $test_elements['test_name'] = $tests_array[$i]['name'];
        $test_elements['available'] = $tests_array[$i]['available'];
        $test_elements['completed'] = $tests_array[$i]['test_passed'];
        $test_elements['start_time'] = strtotime($tests_array[$i]['test_start_time']);
        $test_elements['end_time'] = strtotime($tests_array[$i]['test_end_time']);
        $tests_output[] = $test_elements;
    }

    $completed_article_query = $conn->prepare("SELECT `article_code` FROM `student_article_progress` WHERE `student_code` = :student_code");
    $completed_article_query->bindValue('student_code', $student_code);
    $completed_article_query->execute();
    $completed_article_array = $completed_article_query->fetchAll(PDO::FETCH_ASSOC);
    $completed_articles[] = -1;
    for ($i = 0; $i < count($completed_article_array); $i++) {
        $completed_articles[] = $completed_article_array[$i]['article_code'];
    }

    $course_chapters_query = $conn->prepare("SELECT `chapters`.`sequence_chapter` AS `chapter_sequence`, `chapters`.`name` AS `chapter_name`, `article`.`name` AS `article_name`, `article`.`sequence_article` AS `article_sequence`, `article`.`code` AS `article_code`, `article`.`path_to_pdf`, `courses_structure`.`sequence_number` FROM `courses_structure` LEFT JOIN `chapters` ON `courses_structure`.`chapter_code` = `chapters`.`code` LEFT JOIN `article` ON `article`.`chapter_code` = `chapters`.`code` WHERE `courses_structure`.`course_code` = :course_code AND `chapters`.`name` IS NOT NULL ORDER BY `chapters`.`sequence_chapter` ASC, `article`.`sequence_article` ASC");
    $course_chapters_query->bindValue(':course_code', $course_code, PDO::PARAM_STR);
    $course_chapters_query->execute();
    $course_chapters_array = $course_chapters_query->fetchAll(PDO::FETCH_ASSOC);

    $chapter = [];
    $article = [];
    $chapters_array_output = [];
    $articles_array = [];
    $chapter_progress = 0;
    $first_chapter_id = 0;
    $last_chapter_id = 0;
    $array_length = count($course_chapters_array);
    $previousChapter = $course_chapters_array[0]['chapter_sequence'];
    $lastChapter = $course_chapters_array[$array_length - 1]['chapter_sequence'];
    $lastArticle = $course_chapters_array[$array_length - 1]['article_sequence'];

    for ($i = 0; $i < $array_length; $i++) {
        if ($course_chapters_array[$i]['chapter_sequence'] == $previousChapter) {
            $article['code'] = $course_chapters_array[$i]['article_code'];
            $article['article_sequence'] = intval($course_chapters_array[$i]['article_sequence']);
            $article['article_name'] = $course_chapters_array[$i]['article_name'];
            if (array_search($course_chapters_array[$i]['article_code'], $completed_articles)) {
                $completed = "1";
            } else {
                $completed = "0";
            }
            $article['completed'] = $completed;
            $article['path_to_pdf'] = $course_chapters_array[$i]['path_to_pdf'];
            if ($article['completed'] == "1") $chapter_progress += 1;
            $articles_array[] = $article;
            $article = [];
            if ($course_chapters_array[$i]['chapter_sequence'] == $lastChapter && $course_chapters_array[$i]['article_sequence'] == $lastArticle) {
                $chapter['element_sequence'] = $course_chapters_array[$i]['sequence_number'];
                $chapter['chapter_sequence'] = $course_chapters_array[$i]['chapter_sequence'];
                $chapter['chapter_name'] = $course_chapters_array[$i]['chapter_name'];
                $chapter_progress = $chapter_progress / (count($articles_array)) * 100;
                $chapter['chapter_progress'] = $chapter_progress;
                $chapter['is_test'] = false;
                $chapter['articles'] = $articles_array;
                $chapters_array_output[] = $chapter;
            }
        } else {
            $chapter['element_sequence'] = $course_chapters_array[$i - 1]['sequence_number'];
            $chapter['chapter_sequence'] = $course_chapters_array[$i - 1]['chapter_sequence'];
            $chapter['chapter_name'] = $course_chapters_array[$i - 1]['chapter_name'];
            $chapter_progress = $chapter_progress / (count($articles_array)) * 100;
            $chapter['chapter_progress'] = $chapter_progress;
            $chapter['is_test'] = false;
            $chapter['articles'] = $articles_array;
            $chapters_array_output[] = $chapter;
            $chapter_progress = 0;

            $chapter = [];
            $articles_array = [];
            $previousChapter = $course_chapters_array[$i]['chapter_sequence'];

            $article['code'] = $course_chapters_array[$i]['article_code'];
            $article['article_sequence'] = intval($course_chapters_array[$i]['article_sequence']);
            $article['article_name'] = $course_chapters_array[$i]['article_name'];
            if (array_search($course_chapters_array[$i]['article_code'], $completed_articles)) {
                $completed = "1";
            } else {
                $completed = "0";
            }
            $article['completed'] = $completed;
            $article['path_to_pdf'] = $course_chapters_array[$i]['path_to_pdf'];
            if ($article['completed'] == "1") $chapter_progress += 1;
            $articles_array[] = $article;
            $article = [];
        }
    }

    $tests_length = count($tests_output);
    for ($i = 0; $i < $tests_length; $i++) {
        $chapters_array_output[] = $tests_output[$i];
    }

    $one_time = true;
    $course_collapse = [];
    $course_structure = $chapters_array_output;
    $course_structure_asc = [];
    $current_sequence = 1;
    $array_length = count($course_structure);

    for ($i = 0; $i < $array_length; $i++) {
        for ($j = 0; $j < $array_length; $j++) {
            if ($course_structure[$j]['element_sequence'] == $current_sequence) {
                if ($course_structure[$j]['is_test'] == false) {
                    if ($one_time) {
                        $first_chapter_id = $i;
                        $one_time = false;
                    }
                    $course_collapse[$course_structure[$j]['element_sequence']] = true;
                }
                $course_structure_asc[] = $course_structure[$j];
                $current_sequence++;
                unset($course_structure[$j]);
                break;
            }
            print_r($course_structure[$j]);
        }
    }

    $course_info_array['first_chapter_id'] = $first_chapter_id;
    $course_info_array['course_collapse'] = $course_collapse;
    $course_info_array['course_structure'] = $course_structure_asc;
    $json = json_encode($course_info_array, JSON_UNESCAPED_UNICODE);
    echo $json;

} else {
    echo "Access Denied!";
}