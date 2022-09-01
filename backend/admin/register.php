<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require __DIR__ . '/../classes/Database.php';
require __DIR__ . '/../AuthMiddleware.php';

$db_connection = new Database();
$conn = $db_connection->dbConnection();
$data = json_decode(file_get_contents("php://input"));

function msg($success, $status, $message, $extra = [])
{
    return array_merge([
        'success' => $success,
        'status' => $status,
        'message' => $message
    ], $extra);
}

$allHeaders = getallheaders();
$db_connection = new Database();
$conn = $db_connection->dbConnection();
$auth = new Auth($conn, $allHeaders);
$user_data = ($auth->isValid());

$user_email = $user_data['user']['email'];
$user_code = $user_data['user']['code'];

if (!filter_var($user_email, FILTER_VALIDATE_EMAIL)) :
    $returnData = msg(0, 422, 'Неверный адрес электронной почты!');

else:
    $user_role = "SELECT * FROM `admin` WHERE code=:code AND email=:email";
    $query_user_role = $conn->prepare($user_role);
    $query_user_role->bindValue(':code', $user_code, PDO::PARAM_STR);
    $query_user_role->bindValue(':email', $user_email, PDO::PARAM_STR);
    $query_user_role->execute();


    if ($query_user_role->rowCount()):
        $type_user = trim($data->type_user);
        $email = trim($data->email);
        $password = trim($data->password);
        $name = trim($data->name);

        if ($type_user == 'student'):
            try {
                $check_email = "SELECT `email` FROM `students` WHERE `email`=:email";
                $check_email_stmt = $conn->prepare($check_email);
                $check_email_stmt->bindValue(':email', $email, PDO::PARAM_STR);
                $check_email_stmt->execute();

                if ($check_email_stmt->rowCount()) :
                    $returnData = msg(0, 422, 'Адрес электронной почты уже занят!');

                else :
                    $insert_query = "INSERT INTO `students`(`full_name`,`email`,`password`) VALUES(:name,:email,:password)";

                    $insert_stmt = $conn->prepare($insert_query);

                    // DATA BINDING
                    $insert_stmt->bindValue(':name', htmlspecialchars(strip_tags($name)), PDO::PARAM_STR);
                    $insert_stmt->bindValue(':email', $email, PDO::PARAM_STR);
                    $insert_stmt->bindValue(':password', password_hash($password, PASSWORD_DEFAULT), PDO::PARAM_STR);

                    $insert_stmt->execute();

                    $returnData = msg(1, 201, 'Студент успешно зарегестрирован!');

                endif;
            } catch (PDOException $e) {
                $returnData = msg(0, 500, $e->getMessage());
            }
        else:
            try {
                $check_email = "SELECT `email` FROM `admin` WHERE `email`=:email";
                $check_email_stmt = $conn->prepare($check_email);
                $check_email_stmt->bindValue(':email', $email, PDO::PARAM_STR);
                $check_email_stmt->execute();

                if ($check_email_stmt->rowCount()) :
                    $returnData = msg(0, 422, 'Адрес электронной почты уже занят!');

                else :
                    $insert_query = "INSERT INTO `admin`(`full_name`,`email`,`password`) VALUES(:name,:email,:password)";

                    $insert_stmt = $conn->prepare($insert_query);

                    // DATA BINDING
                    $insert_stmt->bindValue(':name', htmlspecialchars(strip_tags($name)), PDO::PARAM_STR);
                    $insert_stmt->bindValue(':email', $email, PDO::PARAM_STR);
                    $insert_stmt->bindValue(':password', password_hash($password, PASSWORD_DEFAULT), PDO::PARAM_STR);

                    $insert_stmt->execute();

                    $returnData = msg(1, 201, 'Администратор успешно зарегестрирован!');

                endif;
            } catch (PDOException $e) {
                $returnData = msg(0, 500, $e->getMessage());
            }
        endif;
    endif;
endif;

echo json_encode($returnData);