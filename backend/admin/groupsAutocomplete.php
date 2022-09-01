<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST, GET");
header("Content-Type: application/json; charset=UTF-8; text/plain");
header("Access-Control-Allow-Headers: Origin, Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

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
    $organizations_query = $conn->prepare("SELECT `organization_name` AS `name`, `address` FROM `students_groups`");
    $organizations_query->execute();
    $organizations = $organizations_query->fetchAll(PDO::FETCH_ASSOC);
    $organizations_length = count($organizations);
    $organizations_output = [];
    for ($i = 0; $i < $organizations_length; $i++) {
        $organizations_output[$organizations[$i]['name']] = $organizations[$i]['address'];
    }

    $study_programs_query = $conn->prepare("SELECT `name`, `code` FROM `courses`");
    $study_programs_query->execute();
    $study_programs = $study_programs_query->fetchAll(PDO::FETCH_ASSOC);
    $study_programs_length = count($study_programs);
    $study_programs_output = [];

    for ($i = 0; $i < $study_programs_length; $i++) {
        $study_programs_tests_query = $conn->prepare("SELECT `test_code`, `name` FROM `courses_structure`, `tests` WHERE `courses_structure`.`test_code` = `tests`.`code` AND `courses_structure`.`test_code` IS NOT NULL AND `courses_structure`.`course_code` = :course_code");
        $study_programs_tests_query->bindValue(':course_code', $study_programs[$i]['code']);
        $study_programs_tests_query->execute();
        $study_programs_tests = $study_programs_tests_query->fetchAll(PDO::FETCH_ASSOC);
        $study_programs_tests_length = count($study_programs_tests);
        $course_tests = [];

        for ($j = 0; $j < $study_programs_tests_length; $j++) {
            $tests_element = [];
            $tests_element['code'] = $study_programs_tests[$j]['test_code'];
            $tests_element['test_name'] = $study_programs_tests[$j]['name'];
            $course_tests[] = $tests_element;
        }

        $study_program_element = [];
        $study_program_element['course_code'] = $study_programs[$i]['code'];
        $study_program_element['course_name'] = $study_programs[$i]['name'];
        $study_program_element['tests'] = $course_tests;
        $study_programs_output[] = $study_program_element;
    }

    $autocomplete['organizations'] = $organizations_output;
    $autocomplete['study_programs'] = $study_programs_output;

    echo json_encode($autocomplete, JSON_UNESCAPED_UNICODE);
} else {
    echo "Access Denied!";
}