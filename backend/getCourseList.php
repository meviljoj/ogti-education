<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require __DIR__.'/classes/Database.php';
require __DIR__.'/AuthMiddleware.php';

$allHeaders = getallheaders();
$db_connection = new Database();
$conn = $db_connection->dbConnection();
$auth = new Auth($conn, $allHeaders);
$auth_data = ($auth->isValid());

if ($auth_data['success'] == 1) {
    if ($auth_data['user']['role'] == 'admin') {
        $result_set = $conn->prepare("SELECT * FROM `courses`");
        $result_set->execute();
        $array = $result_set->fetchAll(PDO::FETCH_ASSOC);
        $json = json_encode($array, JSON_UNESCAPED_UNICODE);
        echo $json;
    } else {
        $student_group = $conn->prepare("SELECT `group_code` FROM `students` WHERE `code` = :user_code");
        $student_group->bindValue(':user_code', $auth_data['user']['code'], PDO::PARAM_STR);
        $student_group->execute();
        $student_group_code = $student_group->fetch(PDO::FETCH_ASSOC);
        $group_code = $student_group_code['group_code'];
        $available_courses = $conn->prepare("SELECT `courses_code` FROM `courses_access` WHERE `groups_code` = :group_code");
        $available_courses->bindValue(':group_code', intval($group_code), PDO::PARAM_STR);
        $available_courses->execute();
        $available_courses_code = $available_courses->fetchAll(PDO::FETCH_ASSOC);
        $courses_len = count($available_courses_code);
        $course_content_array = [];
        for ($i = 0; $i < $courses_len; $i++) {
            $course_code = intval($available_courses_code[$i]['courses_code']);
            $course_content = $conn->prepare("SELECT * FROM `courses` WHERE `code` = :course");
            $course_content->bindValue(':course', $course_code, PDO::PARAM_STR);
            $course_content->execute();
            $array = $course_content->fetch(PDO::FETCH_ASSOC);
            $course_content_array[] = $array;
        }
        $json = json_encode($course_content_array, JSON_UNESCAPED_UNICODE);
        echo $json;
    }
}
else {
    echo ("У вас нету доступа");
}