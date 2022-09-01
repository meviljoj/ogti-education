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
            if ($questions[$i]['answer_is_correct'] == "1") {
                $count_correct_answers += 1;
            }

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
            $all_questions[] = $one_question;

            $user_answer = false;
            $answer_correct = true;
            $one_question = [];
            $count_correct_answers = 0;

            if ($questions[$i]['answer_is_correct'] == "1") {
                $count_correct_answers += 1;
            }

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
            $all_questions[] = $one_question;
        }

        $previous_question = $questions[$i]['question_common_code'];
    }

    $passing_percentage_query = $conn->prepare("SELECT `passing_percentage` FROM `tests` WHERE `code` = :test_code");
    $passing_percentage_query->bindValue(':test_code', $test_code);
    $passing_percentage_query->execute();
    $passing_percentage = $passing_percentage_query->fetch(PDO::FETCH_ASSOC);
    $passing_percentage = $passing_percentage['passing_percentage'];

    $array_length = count($all_questions);
    $correct_answers = 0;
    for ($i = 0; $i < $array_length; $i++) {
        if ($all_questions[$i]['user_answered'] == true) {
            if ($all_questions[$i]['answer_correct'] == true) {
                $correct_answers += 1;
            }
        }
    }
    $correct_answers_percentage = $correct_answers / $array_length * 100;

    if ($correct_answers_percentage >= $passing_percentage) {
        $test_passed = 1;
    } else {
        $test_passed = 0;
    }

    $complete_test_query = $conn->prepare("UPDATE `student_test_progress` SET `available` = '0', `correct_answers_percentage` = :correct_answers_percentage, `test_passed` = :test_passed, `test_start_time` = NULL, `test_end_time` = NULL WHERE `student_test_progress`.`student_code` = :student_code AND `student_test_progress`.`test_code` = :test_code ");
    $complete_test_query->bindValue(':correct_answers_percentage', $correct_answers_percentage);
    $complete_test_query->bindValue(':test_passed', $test_passed);
    $complete_test_query->bindValue(':student_code', $user_data['user']['code']);
    $complete_test_query->bindValue(':test_code', $test_code);
    $complete_test_query->execute();

    if ($test_passed == 1) {
        $returnData = array_merge([
           'success' => 1
        ]);
    } else {
        $returnData = array_merge([
            'success' => 0
        ]);
    }
    echo json_encode($returnData);
} else {
    echo "Access Denied!";
}