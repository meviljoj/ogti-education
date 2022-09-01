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
$article_code= trim($data->article_code);

$user_data = ($auth->isValid());
if ($user_data['user']['role'] == 'student') {
    $insert_query = "INSERT INTO `student_article_progress` (`student_code`, `article_code`) VALUES (:user_code, :article_code)";
    $insert_stmt = $conn->prepare($insert_query);
    $insert_stmt->bindValue(':user_code', $user_data['user']['code']);
    $insert_stmt->bindValue(':article_code', $article_code);
    $insert_stmt->execute();
    echo "GOOOD";
} else {
    echo('Access Denied!');
}