<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require __DIR__ . '/classes/Database.php';
require __DIR__ . '/classes/JwtHandler.php';

function msg($success, $status, $message, $extra = [])
{
    return array_merge([
        'success' => $success,
        'status' => $status,
        'message' => $message
    ], $extra);
}

$db_connection = new Database();
$conn = $db_connection->dbConnection();

$data = json_decode(file_get_contents("php://input"));
$returnData = [];

// IF REQUEST METHOD IS NOT EQUAL TO POST
if ($_SERVER["REQUEST_METHOD"] != "POST"):
    $returnData = msg(0, 404, 'Страница не найдена!');

// CHECKING EMPTY FIELDS
elseif (!isset($data->email)
    || !isset($data->password)
    || empty(trim($data->email))
    || empty(trim($data->password))
):

    $fields = ['fields' => ['email', 'password']];
    $returnData = msg(0, 422, 'Необходимо заполнить все поля!!', $fields);

// IF THERE ARE NO EMPTY FIELDS THEN-
else:
    $email = trim($data->email);
    $password = trim($data->password);

    // CHECKING THE EMAIL FORMAT (IF INVALID FORMAT)
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)):
        $returnData = msg(0, 422, 'Наверный Email!');

    // IF PASSWORD IS LESS THAN 8 THE SHOW THE ERROR
    elseif (strlen($password) < 8):
        $returnData = msg(0, 422, 'Пароль должен состоять из восьми или более символов!');

    // THE USER IS ABLE TO PERFORM THE LOGIN ACTION
    else:
        try {
            $found_user = false;
            $found_admin = false;
            $fetch_user_by_email = "SELECT * FROM `students` WHERE `email`=:email";
            $fetch_admin_by_email = "SELECT * FROM `admin` WHERE `email`=:email";

            $query_stmt_user = $conn->prepare($fetch_user_by_email);
            $query_stmt_user->bindValue(':email', $email, PDO::PARAM_STR);
            $query_stmt_user->execute();

            $query_stmt_admin = $conn->prepare($fetch_admin_by_email);
            $query_stmt_admin->bindValue(':email', $email, PDO::PARAM_STR);
            $query_stmt_admin->execute();

            // IF THE USER IS FOUNDED BY EMAIL
            if ($query_stmt_user->rowCount()):
                $row = $query_stmt_user->fetch(PDO::FETCH_ASSOC);
                $check_password = password_verify($password, $row['password']);
                $found_user = true;
                // VERIFYING THE PASSWORD (IS CORRECT OR NOT?)
                // IF PASSWORD IS CORRECT THEN SEND THE LOGIN TOKEN
                if ($check_password):

                    $jwt = new JwtHandler();
                    $token = $jwt->jwtEncodeData(
                        'http://localhost/ogti-education/',
                        array("code" => $row['code'])
                    );

                    $returnData = [
                        'success' => 1,
                        'message' => 'You have successfully logged in.',
                        'token' => $token,
                        'user_id' => $row['code'],
                        'user_role' => 'student'
                    ];

                // IF INVALID PASSWORD
                else:
                    $returnData = msg(0, 422, 'Неверный пароль!');
                endif;
            endif;

            if ($query_stmt_admin->rowCount()):
                $row = $query_stmt_admin->fetch(PDO::FETCH_ASSOC);
                $check_password = password_verify($password, $row['password']);
                $found_admin = true;

                // VERIFYING THE PASSWORD (IS CORRECT OR NOT?)
                // IF PASSWORD IS CORRECT THEN SEND THE LOGIN TOKEN
                if ($check_password):

                    $jwt = new JwtHandler();
                    $token = $jwt->jwtEncodeData(
                        'http://localhost/php_auth_api/',
                        array("code" => $row['code'])
                    );

                    $returnData = [
                        'success' => 1,
                        'message' => 'You have successfully logged in.',
                        'token' => $token,
                        'code' => $row['code'],
                        'user_role' => 'admin'
                    ];

                // IF INVALID PASSWORD
                else:
                    $returnData = msg(0, 422, 'Неверный пароль!');
                endif;
            endif;

            if (!$found_user and !$found_admin):
                $returnData = msg(0, 422, 'Неверный Email!');
            endif;

        } catch (PDOException $e) {
            $returnData = msg(0, 500, $e->getMessage());
        }
    endif;
endif;

echo json_encode($returnData);