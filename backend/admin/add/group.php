<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

date_default_timezone_set('Asia/Yekaterinburg');

require __DIR__ . '/../../classes/Database.php';
require __DIR__ . '/../../AuthMiddleware.php';

$db_connection = new Database();
$conn = $db_connection->dbConnection();

$data = json_decode(file_get_contents("php://input"));
$operation = trim($data->operation);
$group_values = (array)$data->group_values;
$tests_time = $data->tests_time;
$students_values = $data->students_values;

$chars = 'qazxswedcvfrtgbnhyujmkiolp1234567890QAZXSWEDCVFRTGBNHYUJMKIOLP';
$size = strlen($chars) - 1;

$allHeaders = getallheaders();
$auth = new Auth($conn, $allHeaders);
$user_data = ($auth->isValid());

if ($user_data['user']['role'] == 'admin') {
    if ($operation == 'add') {
        $add_group_query = $conn->prepare("INSERT INTO `students_groups` (`organization_name`, `address`, `start_date`, `end_date`) VALUES (:organization_name, :address, :start_date, :end_date)");
        $add_group_query->bindValue(':organization_name', $group_values['input_name']);
        $add_group_query->bindValue(':address', $group_values['address']);
        $add_group_query->bindValue(':start_date', substr_replace($group_values['start_date'], '', 10, 15));
        $add_group_query->bindValue(':end_date', substr_replace($group_values['end_date'], '', 10, 15));
        $add_group_query->execute();
        $group_code=$conn->lastInsertId();

        if ($group_values['study_program'] != '') {
            $group_access_query = $conn->prepare("INSERT INTO `courses_access` (`groups_code`, `courses_code`) VALUES (:groups_code, :courses_code)");
            $group_access_query->bindValue(':groups_code', $group_code);
            $group_access_query->bindValue(':courses_code', $group_values['study_program']);
            $group_access_query->execute();
            for ($i = 0; $i < count($tests_time); $i++) {
                $test = (array)$tests_time[$i];
                if ($test['end_time'] != null && $test['start_time'] != null) {
                    $test_time_query = $conn->prepare("INSERT INTO `tests_time` (`group_code`, `test_code`, `start_time`, `end_time`) VALUES (:group_code, :test_code, :start_time, :end_time)");
                    $test_time_query->bindValue(':group_code', $group_code);
                    $test_time_query->bindValue(':test_code', $test['code']);
                    $start_time = substr_replace($test['start_time'], '', -5, 5);
                    $start_time = substr_replace($start_time, ' ', 10, 1);
                    $test_time_query->bindValue(':start_time', $start_time);
                    $end_time = substr_replace($test['end_time'], '', -5, 5);
                    $end_time = substr_replace($start_time, ' ', 10, 1);
                    $test_time_query->bindValue(':end_time', $end_time);
                    $test_time_query->execute();
                }
            }
        }
        for ($i = 0; $i < count($students_values); $i++) {
            $student = (array)$students_values[$i];
            $student_query = $conn->prepare("INSERT INTO `students` (`group_code`, `full_name`, `email`, `password`) VALUES (:group_code, :full_name, :email, :password)");
            $student_query->bindValue(':group_code', $group_code);
            $student_query->bindValue(':full_name', $student['name']);
            $student_query->bindValue(':email', $student['email']);
            $password = '';
            $length = 8;
            while($length--) {
                $password .= $chars[random_int(0, $size)];
            }
            $student_query->bindValue(':password', password_hash($password, PASSWORD_DEFAULT));
            $student_query->execute();
        }
    } else {
        $edit_group_query = $conn->prepare("UPDATE `students_groups` SET `organization_name` = :organization_name, `address` = :address, `start_date` = :start_date, `end_date` = :end_date WHERE `students_groups`.`code` = :group_code");
        $group_code = $group_values['code'];
        $edit_group_query->bindValue(':group_code', $group_code);
        $edit_group_query->bindValue(':organization_name', $group_values['input_name']);
        $edit_group_query->bindValue(':address', $group_values['address']);
        $edit_group_query->bindValue(':start_date', substr_replace($group_values['start_date'], '', 10, 15));
        $edit_group_query->bindValue(':end_date', substr_replace($group_values['end_date'], '', 10, 15));
        $edit_group_query->execute();

        if ($group_values['study_program'] != '') {
            $edit_access_query = $conn->prepare("UPDATE `courses_access` SET `courses_code` = :courses_code WHERE `courses_access`.`groups_code` = :groups_code");
            $edit_access_query->bindValue(':groups_code', $group_code);
            $edit_access_query->bindValue(':courses_code', $group_values['study_program']);
            $edit_access_query->execute();

            for ($i = 0; $i < count($tests_time); $i++) {
                $test = (array)$tests_time[$i];

                if ($test['end_time'] != null && $test['start_time'] != null) {
                    $test_time_exist_query = $conn->prepare("SELECT * FROM `tests_time` WHERE `tests_time`.`test_code` = :test_code AND `tests_time`.`group_code` = :group_code");
                    $test_time_exist_query->bindValue(':group_code', $group_code);
                    $test_time_exist_query->bindValue(':test_code', $test['code']);
                    $test_time_exist_query->execute();
                    if ($test_time_exist_query->rowCount() == 0) {
                        $test_time_query = $conn->prepare("INSERT INTO `tests_time` (`group_code`, `test_code`, `start_time`, `end_time`) VALUES (:group_code, :test_code, :start_time, :end_time)");
                        $test_time_query->bindValue(':group_code', $group_code);
                        $test_time_query->bindValue(':test_code', $test['code']);
                        $start_time = substr_replace($test['start_time'], '', -5, 5);
                        $start_time = substr_replace($start_time, ' ', 10, 1);
                        $test_time_query->bindValue(':start_time', $start_time);
                        $end_time = substr_replace($test['end_time'], '', -5, 5);
                        $end_time = substr_replace($start_time, ' ', 10, 1);
                        $test_time_query->bindValue(':end_time', $end_time);
                        $test_time_query->execute();
                    } else {
                        $test_time_query = $conn->prepare("UPDATE `tests_time` SET `start_time` = :start_time, `end_time` = :end_time WHERE `tests_time`.`test_code` = :test_code AND `tests_time`.`group_code` = :group_code");
                        $test_time_query->bindValue(':group_code', $group_code);
                        $test_time_query->bindValue(':test_code', $test['code']);
                        $start_time = substr_replace($test['start_time'], '', -5, 5);
                        $start_time = substr_replace($start_time, ' ', 10, 1);
                        $test_time_query->bindValue(':start_time', $start_time);
                        $end_time = substr_replace($test['end_time'], '', -5, 5);
                        $end_time = substr_replace($start_time, ' ', 10, 1);
                        $test_time_query->bindValue(':end_time', $end_time);
                        $test_time_query->execute();
                    }
                }
            }
        }

        $students_code_array = [];
        for ($i = 0; $i < count($students_values); $i++) {
            $student = (array)$students_values[$i];
            $students_code_array[] = $student['code'];
        }

        $all_students_query = $conn->prepare("SELECT * FROM `students` WHERE `group_code` = :group_code");
        $all_students_query->bindValue(':group_code', $group_code);
        $all_students_query->execute();
        $all_students = $all_students_query->fetchAll();
        for ($i = 0; $i < count($all_students); $i++) {
            if (!in_array($all_students[$i]['code'], $students_code_array)) {
                $delete_student_query = $conn->prepare("DELETE FROM `students` WHERE `students`.`code` = :student_code");
                $delete_student_query->bindValue(':student_code', $all_students[$i]['code']);
                $delete_student_query->execute();
            }
        }

        for ($i = 0; $i < count($students_values); $i++) {
            $student = (array)$students_values[$i];

            $student_exist_query = $conn->prepare("SELECT * FROM `students` WHERE `code` = :student_code");
            $student_exist_query->bindValue(':student_code', $student['code']);
            $student_exist_query->execute();

            if ($student_exist_query->rowCount() == 0) {
                if ($student['name'] != '' && $student['email'] != '') {
                    $student_query = $conn->prepare("INSERT INTO `students` (`group_code`, `full_name`, `email`, `password`) VALUES (:group_code, :full_name, :email, :password)");
                    $student_query->bindValue(':group_code', $group_code);
                    $student_query->bindValue(':full_name', $student['name']);
                    $student_query->bindValue(':email', $student['email']);
                    $password = '';
                    $length = 12к;

                    while($length--) {
                        $password .= $chars[random_int(0, $size)];
                    }

                    echo $password;

                    $student_query->bindValue(':password', password_hash($password, PASSWORD_DEFAULT));
                    $student_query->execute();

                    $message = 'Вам предоставлен доступ к программе обучения "Охрана труда". Ваши учетные данные Логин: ' . $student['email'] . " Пароль: " . $password;
                    $to = $student['email'];
                    $from = "education@og-ti.ru";
                    $subject = "Учетные данные для доступа к платформе онлайн-образования ОГТИ";

                    $subject = "=?utf-8?B?".base64_encode($subject)."?=";
                    $headers = "From: $from\r\nReply-to: $from\r\nContent-type:text/plain; charset=urf-8\r\n";

                    mail($to, $subject, $message, $headers);
                }
            } else {
                $student_query = $conn->prepare("UPDATE `students` SET `full_name` = :full_name, `email` = :email WHERE `students`.`code` = :student_code");
                $student_query->bindValue(':student_code', $student['code']);
                $student_query->bindValue(':full_name', $student['name']);
                $student_query->bindValue(':email', $student['email']);
                $student_query->execute();
            }
        }
    }
} else {
    echo 'Access Denied!';
}