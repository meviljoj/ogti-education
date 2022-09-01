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

if ($user_data['user']['role'] == 'admin') {
    $questions_query = $conn->prepare("SELECT `question_common`.*, `question_common_answers`.* FROM `question_common` LEFT JOIN `question_common_answers` ON `question_common_answers`.`question_common_code` = `question_common`.`code` WHERE `question_common`.`test_code` = :test_code ORDER BY `question_common_answers`.`question_common_code` ASC");
    $questions_query->bindValue(':test_code', $test_code);
    $questions_query->execute();
    $questions = $questions_query->fetchAll(PDO::FETCH_ASSOC);

    $array_length = count($questions);
    $previous_question = $questions[0]['question_common_code'];
    $last_answer = $questions[$array_length - 1]['code'];
    $count_correct_answers = 0;
    $answers = [];
    $all_questions = [];
    $one_question = [];

    for ($i = 0; $i < $array_length; $i++) {
        if ($previous_question == $questions[$i]['question_common_code']) {
            $one_answer = [];
            if ($questions[$i]['answer_is_correct'] == "1") {
                $count_correct_answers += 1;
            }
            $one_answer['answer_text'] = $questions[$i]['answer'];
            $one_answer['answer_is_correct'] = $questions[$i]['answer_is_correct'];
            $answers[] = $one_answer;
        } else {
            $one_question['question_text'] = $questions[$i - 1]['question'];
            if ($count_correct_answers > 1) {
                $one_question['question_type'] = 'multiple';
            } else {
                $one_question['question_type'] = 'single';
            }
            $one_question['answers'] = $answers;
            $all_questions[] = $one_question;

            $one_question = [];
            $answers = [];
            $count_correct_answers = 0;

            $one_answer = [];
            if ($questions[$i]['answer_is_correct'] == "1") {
                $count_correct_answers += 1;
            }
            $one_answer['answer_text'] = $questions[$i]['answer'];
            $one_answer['answer_is_correct'] = $questions[$i]['answer_is_correct'];
            $answers[] = $one_answer;
        }
        if ($questions[$i]['code'] == $last_answer) {
            $one_question['question_text'] = $questions[$i]['question'];
            if ($count_correct_answers > 1) {
                $one_question['question_type'] = 'multiple';
            } else {
                $one_question['question_type'] = 'single';
            }
            $one_question['answers'] = $answers;
            $all_questions[] = $one_question;
        }
        $previous_question = $questions[$i]['question_common_code'];
    }

    $json = json_encode($all_questions, JSON_UNESCAPED_UNICODE);
    echo $json;
} else {
    echo('Access Denied!');
}