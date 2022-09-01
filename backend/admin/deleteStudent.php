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

$allHeaders = getallheaders();
$db_connection = new Database();
$conn = $db_connection->dbConnection();
$auth = new Auth($conn, $allHeaders);
$user_data = ($auth->isValid());

$user_email = $user_data['user']['email'];
$user_code = $user_data['user']['code'];

$user_role = "SELECT * FROM `admin` WHERE code=:code AND email=:email";
$query_user_role = $conn->prepare($user_role);
$query_user_role->bindValue(':code', $user_code, PDO::PARAM_STR);
$query_user_role->bindValue(':email', $user_email, PDO::PARAM_STR);
$query_user_role->execute();

if ($query_user_role->rowCount()) {
    $user_id_array = trim($data->user_id);
    $length = count($user_id_array);
    for ($i = 0; $i < count($user_id_array); $i++) {

    }
}