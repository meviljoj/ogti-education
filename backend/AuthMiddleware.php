<?php
require __DIR__ . '/classes/JwtHandler.php';

class Auth extends JwtHandler
{
    protected $db;
    protected $headers;
    protected $token;

    public function __construct($db, $headers)
    {
        parent::__construct();
        $this->db = $db;
        $this->headers = $headers;
    }

    public function isValid()
    {

        if (array_key_exists('Authorization', $this->headers) && preg_match('/Bearer\s(\S+)/', $this->headers['Authorization'], $matches)) {

            $data = $this->jwtDecodeData($matches[1]);

            if (
                isset($data['data']->code) &&
                $user = $this->fetchUser($data['data']->code)
            ) :
                return [
                    "success" => 1,
                    "user" => $user
                ];
            else :
                return [
                    "success" => 0,
                    "message" => $data['message'],
                ];
            endif;
        } else {
            return [
                "success" => 0,
                "message" => "Token not found in request"
            ];
        }
    }

    protected function fetchUser($user_id)
    {
        try {
            $fetch_student_by_id = "SELECT `code`, `group_code`, `full_name`, `email` FROM `students` WHERE `code`=:id";
            $query_stmt_student = $this->db->prepare($fetch_student_by_id);
            $query_stmt_student->bindValue(':id', $user_id, PDO::PARAM_INT);
            $query_stmt_student->execute();
            $array_stmt_student = $query_stmt_student->fetch(PDO::FETCH_ASSOC);
            $array_stmt_student['role'] = 'student';

            $fetch_admin_by_id = "SELECT `code`,`email`,`full_name` FROM `admin` WHERE `code`=:id";
            $query_stmt_admin = $this->db->prepare($fetch_admin_by_id);
            $query_stmt_admin->bindValue(':id', $user_id, PDO::PARAM_INT);
            $query_stmt_admin->execute();
            $array_stmt_admin = $query_stmt_admin->fetch(PDO::FETCH_ASSOC);
            $array_stmt_admin['role'] = 'admin';

            if ($query_stmt_student->rowCount()):
                return $array_stmt_student;
            elseif ($query_stmt_admin->rowCount()):
                return $array_stmt_admin;
            else:
                return false;
            endif;
        } catch (PDOException $e) {
            return null;
        }
    }
}