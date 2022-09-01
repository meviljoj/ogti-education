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
echo (file_get_contents("php://input"));
$data = json_decode(file_get_contents("php://input"));
$user_data = ($auth->isValid());
$answer_type = trim($data->answer_type);

if ($user_data['user']['role'] == 'student') {
    if ($answer_type == 'single') {
        $check_accomplishment = $conn->prepare("SELECT * FROM `student_common_answers` WHERE `answer_code` = :answer_code AND `student_code` = :student_code");
        $check_accomplishment->bindValue(':answer_code', trim($data->answer_code));
        $check_accomplishment->bindValue(':student_code', $user_data['user']['code']);
        $check_accomplishment->execute();
        if ($check_accomplishment->rowCount() == 0)
        {
            $complete_query = $conn->prepare("INSERT INTO `student_common_answers` (`answer_code`, `student_code`) VALUES (:answer_code, :student_code)");
            $complete_query->bindValue(':answer_code', trim($data->answer_code));
            $complete_query->bindValue(':student_code', $user_data['user']['code']);
            $complete_query->execute();
        }
    } else {
        $answer_code = $data->answer_code;
        $answer_code_array = json_decode(json_encode($answer_code), true);
        foreach ($answer_code_array as $key => $value)
        {
            if ($value == true) {
                $check_accomplishment = $conn->prepare("SELECT * FROM `student_common_answers` WHERE `answer_code` = :answer_code AND `student_code` = :student_code");
                $check_accomplishment->bindValue(':answer_code', $key);
                $check_accomplishment->bindValue(':student_code', $user_data['user']['code']);
                $check_accomplishment->execute();
                if ($check_accomplishment->rowCount() == 0) {
                    $complete_query = $conn->prepare("INSERT INTO `student_common_answers` (`answer_code`, `student_code`) VALUES (:answer_code, :student_code)");
                    $complete_query->bindValue(':answer_code', $key);
                    $complete_query->bindValue(':student_code', $user_data['user']['code']);
                    $complete_query->execute();
                }
            }
        }
    }
} else {
    echo('Access Denied!');
}