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

if ($user_data['user']['role'] == 'admin') {
    $course_info_query = $conn->prepare("SELECT `name` FROM `courses` WHERE `courses`.`code` = :course_code");
    $course_info_query->bindValue(':course_code', $course_code, PDO::PARAM_STR);
    $course_info_query->execute();
    $course_info = $course_info_query->fetch(PDO::FETCH_ASSOC);
    $course_info_array['name'] = $course_info['name'];

    $course_structure_query = $conn->prepare("SELECT `courses_structure`.*, `tests`.*, `chapters`.*, `article`.*, `chapters`.`name` AS `chapter_name`, `tests`.`name` AS `test_name`, `article`.`name` AS `article_name`, `chapters`.`sequence_chapter` AS `chapter_sequence`, `article`.`sequence_article` AS `article_sequence` FROM `courses_structure` LEFT JOIN `tests` ON `courses_structure`.`test_code` = `tests`.`code` LEFT JOIN `chapters` ON `courses_structure`.`chapter_code` = `chapters`.`code` LEFT JOIN `article` ON `article`.`chapter_code` = `chapters`.`code` WHERE `courses_structure`.`course_code` = :course_code");
    $course_structure_query->bindValue(':course_code', $course_code, PDO::PARAM_STR);
    $course_structure_query->execute();
    $course_structure = $course_structure_query->fetchAll(PDO::FETCH_ASSOC);
    $array_length = count($course_structure);

    $tests_array = [];
    $test = [];
    $chapters_array = [];
    $chapter = [];
    $articles_array = [];
    $article = [];
    $first_chapter_id = 0;
    $last_chapter_id = 0;

    for ($i = 0; $i < $array_length; $i++) {
        if ($course_structure[$i]['test_code'] == null) {
            $first_chapter_id = $i;
            break;
        }
    }

    for ($i = 0; $i < $array_length; $i++) {
        if ($course_structure[$i]['test_code'] == null) {
            $last_chapter_id = $i;
        }
    }

    $previousChapter = $course_structure[$first_chapter_id]['chapter_sequence'];
    $lastChapter = $course_structure[$last_chapter_id]['chapter_sequence'];
    $lastArticle = $course_structure[$last_chapter_id]['article_sequence'];

    for ($i = 0; $i < $array_length; $i++) {
        if ($course_structure[$i]['test_code'] != null) {
            $test['element_sequence'] = $course_structure[$i]['sequence_number'];
            $test['is_test'] = true;
            $test['code'] = $course_structure[$i]['test_code'];
            $test['test_name'] = $course_structure[$i]['test_name'];
            $tests_array[] = $test;
            $test = [];
        } else {
            if ($course_structure[$i]['chapter_sequence'] == $previousChapter) {
                $article['article_sequence'] = intval($course_structure[$i]['article_sequence']);
                $article['article_name'] = $course_structure[$i]['article_name'];
                $article['path_to_pdf'] = $course_structure[$i]['path_to_pdf'];
                $articles_array[] = $article;
                $article = [];
                if ($course_structure[$i]['chapter_sequence'] == $lastChapter && $course_structure[$i]['article_sequence'] == $lastArticle) {
                    $chapter['element_sequence'] = $course_structure[$i]['sequence_number'];
                    $chapter['chapter_sequence'] = $course_structure[$i]['chapter_sequence'];
                    $chapter['chapter_name'] = $course_structure[$i]['chapter_name'];
                    $chapterProgress = $chapterProgress / $course_structure[$i]['chapter_sequence'] * 100;
                    $chapter['is_test'] = false;
                    $chapter['articles'] = $articles_array;
                    $chapters_array[] = $chapter;
                }
            } else {
                $chapter['element_sequence'] = $course_structure[$i - 1]['sequence_number'];
                $chapter['chapter_sequence'] = $course_structure[$i - 1]['chapter_sequence'];
                $chapter['chapter_name'] = $course_structure[$i - 1]['chapter_name'];
                $chapterProgress = $chapterProgress / $course_structure[$i - 1]['chapter_sequence'] * 100;
                $chapter['is_test'] = false;
                $chapter['articles'] = $articles_array;
                $chapters_array[] = $chapter;
                $chapterProgress = 0;

                $chapter = [];
                $articles_array = [];
                $previousChapter = $course_structure[$i]['chapter_sequence'];

                $article['article_sequence'] = intval($course_structure[$i]['article_sequence']);
                $article['article_name'] = $course_structure[$i]['article_name'];
                $article['path_to_pdf'] = $course_structure[$i]['path_to_pdf'];
                $articles_array[] = $article;
                $article = [];
            }
        }
    }

    $tests_length = count($tests_array);
    for ($i = 0; $i < $tests_length; $i++) {
        $chapters_array[] = $tests_array[$i];
    }

    $one_time = true;
    $course_collapse = [];
    $course_structure = $chapters_array;
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
            }
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