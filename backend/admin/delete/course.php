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
$course_code = trim($data->course_code);

$allHeaders = getallheaders();
$auth = new Auth($conn, $allHeaders);
$user_data = ($auth->isValid());

if ($user_data['user']['role'] == 'admin') {
    $delete_access_query = $conn->prepare("DELETE FROM `courses_access` WHERE `courses_access`.`code` = :course_code");
    $delete_access_query->bindValue(':course_code', $course_code, PDO::PARAM_STR);
    $delete_access_query->execute();

    $delete_structure_query = $conn->prepare("DELETE FROM `courses_structure` WHERE `courses_structure`.`course_code` = :course_code");
    $delete_structure_query->bindValue(':course_code', $course_code, PDO::PARAM_STR);
    $delete_structure_query->execute();

    $delete_course_query = $conn->prepare("DELETE FROM `courses` WHERE `courses`.`code` = :course_code");
    $delete_course_query->bindValue(':course_code', $course_code, PDO::PARAM_STR);
    $delete_course_query->execute();
} else {
    echo "Access Denied!";
}