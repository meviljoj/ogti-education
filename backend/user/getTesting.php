<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require __DIR__ . '/../classes/Database.php';
require __DIR__ . '/../AuthMiddleware.php';

$allHeaders = getallheaders();
$db_connection = new Database();
$conn = $db_connection->dbConnection();
$auth = new Auth($conn, $allHeaders);;
$data = json_decode(file_get_contents("php://input"));
$test_code = trim($data->test_code);
$user_data = ($auth->isValid());

if ($user_data['user']['role'] == 'student') {
    $questions_query = $conn->prepare("SELECT `question_common`.*, `question_common_answers`.*, `student_common_answers`.*, `question_common_answers`.code AS answer_code, `student_common_answers`.answer_code AS student_answer_code FROM `question_common` LEFT JOIN `question_common_answers` ON `question_common_answers`.`question_common_code` = `question_common`.`code` LEFT JOIN `student_common_answers` ON `student_common_answers`.`answer_code` = `question_common_answers`.`code` WHERE `question_common`.`test_code` = :test_code AND `student_common_answers`.`student_code` IS NULL OR `student_common_answers`.`student_code` = :user_code ORDER BY `question_common_answers`.`question_common_code` ASC");
    $questions_query->bindValue(':test_code', $test_code);
    $questions_query->bindValue(':user_code', $user_data['user']['code']);
    $questions_query->execute();
    $questions = $questions_query->fetchAll(PDO::FETCH_ASSOC);

    if ($questions[0]['student_answer_code'] != null) $skip_code = $questions[0]['question_common_code'];
    $array_length = count($questions);
    $previous_question = $questions[0]['question_common_code'];
    $last_answer = $questions[$array_length - 1]['answer_code'];
    $count_correct_answers = 0;
    $answers = [];
    $all_questions = [];
    $one_question = [];
    $user_answer = false;
    $answer_correct = true;

    for ($i = 0; $i < $array_length; $i++) {
        if ($previous_question == $questions[$i]['question_common_code']) {
            if ($questions[$i]['student_answer_code'] != null) {
                $user_answer = true;
                if ($questions[$i]['answer_is_correct'] != "1") {
                    $answer_correct = false;
                }
            } else {
                if ($questions[$i]['answer_is_correct'] == "1") {
                    $answer_correct = false;
                }
            }
            $one_answer = [];
            if ($questions[$i]['answer_is_correct'] == "1") {
                $count_correct_answers += 1;
            }
            $one_answer['answer_code'] = $questions[$i]['answer_code'];
            $one_answer['answer_text'] = $questions[$i]['answer'];
            $answers[] = $one_answer;

        } else {
            if ($questions[$i - 1]['student_answer_code'] != null) {
                $user_answer = true;
                if ($questions[$i - 1]['answer_is_correct'] != "1") {
                    $answer_correct = false;
                }
            } else {
                if ($questions[$i - 1]['answer_is_correct'] == "1") {
                    $answer_correct = false;
                }
            }
            $one_question['question_text'] = $questions[$i - 1]['question'];
            if ($count_correct_answers > 1) {
                $one_question['question_type'] = 'multiple';
            } else {
                $one_question['question_type'] = 'single';
            }
            $one_question['user_answered'] = $user_answer;
            if ($user_answer == true) $one_question['answer_correct'] = $answer_correct;
            $one_question['answers'] = $answers;
            $all_questions[] = $one_question;

            $user_answer = false;
            $answer_correct = true;
            $one_question = [];
            $answers = [];
            $count_correct_answers = 0;

            $one_answer = [];
            if ($questions[$i]['answer_is_correct'] == "1") {
                $count_correct_answers += 1;
            }
            $one_answer['answer_code'] = $questions[$i]['answer_code'];
            $one_answer['answer_text'] = $questions[$i]['answer'];
            $answers[] = $one_answer;

            if ($questions[$i]['student_answer_code'] != null) {
                $user_answer = true;
                if ($questions[$i]['answer_is_correct'] != "1") {
                    $answer_correct = false;
                }
            } else {
                if ($questions[$i]['answer_is_correct'] == "1") {
                    $answer_correct = false;
                }
            }
        }

        if ($questions[$i]['answer_code'] == $last_answer) {
            $one_question['question_text'] = $questions[$i]['question'];
            if ($count_correct_answers > 1) {
                $one_question['question_type'] = 'multiple';
            } else {
                $one_question['question_type'] = 'single';
            }
            $one_question['user_answered'] = $user_answer;
            if ($user_answer == true) $one_question['answer_correct'] = $answer_correct;
            $one_question['answers'] = $answers;
            $all_questions[] = $one_question;
        }

        $previous_question = $questions[$i]['question_common_code'];
    }

    $array_length = count($all_questions);
    $questions_bar = [];
    $bar_element = [];
    $question_number = 1;

    for ($i = 0; $i < $array_length; $i++) {
        if ($all_questions[$i]['user_answered'] == true) {
            if ($all_questions[$i]['answer_correct'] == true) {
                $bar_element['question_number'] = $question_number;
                $bar_element['answer_color'] = "green";
            } else {
                $bar_element['question_number'] = $question_number;
                $bar_element['answer_color'] = "red";
            }
            $questions_bar[] = $bar_element;
            $question_number += 1;
        }
    }

    $first_question_number = $question_number;

    $question_response = [];
    $temp_questions = [];
    for ($i = 0; $i < $array_length; $i++) {
        if ($all_questions[$i]['user_answered'] == false) {
            $temp_questions['question_number'] = $question_number;
            $temp_questions['question_text'] = $all_questions[$i]['question_text'];
            $temp_questions['question_type'] = $all_questions[$i]['question_type'];
            $temp_questions['answers'] = $all_questions[$i]['answers'];
            $question_response[] = $temp_questions;
            $bar_element['question_number'] = $question_number;
            if ($question_number == $first_question_number) {
                $bar_element['answer_color'] = "blue";
            } else {
                $bar_element['answer_color'] = "white";
            }
            $questions_bar[] = $bar_element;
            $question_number += 1;
        }
    }

    $test_response['questions_bar'] = $questions_bar;
    $test_response['questions'] = $question_response;

    $json = json_encode($test_response, JSON_UNESCAPED_UNICODE);
    echo $json;

} else {
    echo('Access Denied!');
}
