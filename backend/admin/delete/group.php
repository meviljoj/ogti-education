<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require __DIR__ . '/../../classes/Database.php';
require __DIR__ . '/../../AuthMiddleware.php';

$db_connection = new Database();
$conn = $db_connection->dbConnection();
$data = json_decode(file_get_contents("php://input"));
$group_code = trim($data->group_code);

$allHeaders = getallheaders();
$auth = new Auth($conn, $allHeaders);
$user_data = ($auth->isValid());

if ($user_data['user']['role'] == 'admin') {
    $delete_group_query = $conn->prepare("DELETE FROM `students_groups` WHERE `code` = :group_code");
    $delete_group_query->bindValue(':group_code', $group_code);
    $delete_group_query->execute();
} else {
    echo 'Access Denied!';
}