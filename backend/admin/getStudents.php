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
$auth = new Auth($conn, $allHeaders);
$course_code = trim($data->course_code);
$user_data = ($auth->isValid());

if ($user_data['user']['role'] == 'admin') {
    $students_query = $conn->prepare("SELECT *, `students`.`code` AS `student_code` FROM `students`, `students_groups`, `courses_access`, `courses` WHERE `students`.`group_code` = `students_groups`.`code` AND `students_groups`.`code` = `courses_access`.`groups_code` AND `courses_access`.`courses_code` = `courses`.`code` ORDER BY `courses_access`.`groups_code` ASC, `students`.`code` ASC");
    $students_query->execute();
    $students = $students_query->fetchAll();
    $students_length = count($students);
    $students_output = [];

    for ($i = 0; $i < $students_length; $i++) {
        $student = [];
        $student['id'] = $students[$i]['student_code'];
        $student['full_name'] = $students[$i]['full_name'];
        $student['email'] = $students[$i]['email'];
        $student['organization_name'] = $students[$i]['organization_name'];
        $student['start_date'] = $students[$i]['start_date'];
        $student['end_date'] = $students[$i]['end_date'];
        $student['name'] = $students[$i]['name'];
        $students_output[] = $student;
    }

    echo json_encode($students_output, JSON_UNESCAPED_UNICODE);

} else {
    echo "Access Denied!";
}