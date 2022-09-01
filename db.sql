-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: May 31, 2022 at 01:30 PM
-- Server version: 5.7.24
-- PHP Version: 8.0.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ogti_educational`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `code` int(11) NOT NULL,
  `full_name` varchar(50) NOT NULL,
  `email` varchar(30) NOT NULL,
  `password` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`code`, `full_name`, `email`, `password`) VALUES
(5, 'Калетин Михаил', 'mevil123@gmail.com', '$2y$10$VCCmrrhsrieFThPE52tFN.r/oJwQKQXp7IHcRZnpB4jOhuADoS4qe'),
(8, 'Первый администратор', 'admin@gmail.com', '$2y$10$hsTYJmL7JGuIyKtoZJXWSu.shYvP8PhZw79.7q1x8tsQTE05Gxmnq');

-- --------------------------------------------------------

--
-- Table structure for table `article`
--

CREATE TABLE `article` (
  `code` int(11) NOT NULL,
  `chapter_code` int(11) NOT NULL,
  `sequence_article` int(3) NOT NULL,
  `name` varchar(250) NOT NULL,
  `path_to_pdf` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `article`
--

INSERT INTO `article` (`code`, `chapter_code`, `sequence_article`, `name`, `path_to_pdf`) VALUES
(1, 3, 1, 'Трудовая деятельность человека', '1-1.pdf'),
(2, 3, 2, 'Основные принципы обеспечения безопасности труда', '1-2.pdf'),
(3, 3, 3, 'Основные принципы обеспечения охраны труда', '1-3.pdf'),
(4, 3, 4, 'Основные положения трудового права', '1-4.pdf'),
(5, 4, 1, 'Обязанности работодателя по обеспечению безопасных условий и охраны труда', '2-1.pdf'),
(6, 4, 2, 'Управление внутренней мотивацией работников на безопасный труд и соблюдение требований охраны труда', '2-2.pdf'),
(7, 4, 3, 'Организация системы управления охраной труда', '2-3.pdf'),
(8, 1, 1, 'Основы предупреждения производственного травматизма', '3-1.pdf'),
(9, 1, 2, 'Техническое обеспечение безопасности зданий и сооружений, оборудования и инструмента, технологических процессов', '3-2.pdf'),
(10, 2, 1, 'Общие правовые принципы возмещения причиненного вреда', '4-1.pdf'),
(11, 2, 2, 'Обязательное социальное страхование от несчастных случаев на производстве и профессиональных заболеваний', '4-2.pdf');

-- --------------------------------------------------------

--
-- Table structure for table `chapters`
--

CREATE TABLE `chapters` (
  `code` int(11) NOT NULL,
  `sequence_chapter` int(3) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `chapters`
--

INSERT INTO `chapters` (`code`, `sequence_chapter`, `name`) VALUES
(1, 3, 'Специальные вопросы обеспечения требований охраны труда и безопасности производственной деятельности'),
(2, 4, 'Общие правовые принципы возмещения причиненного вреда'),
(3, 1, 'Основы охраны труда'),
(4, 2, 'Основы управления охраной труда в организации');

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `code` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `path_to_img` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`code`, `name`, `path_to_img`) VALUES
(1, 'Охрана труда', 'ohrana_truda.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `courses_access`
--

CREATE TABLE `courses_access` (
  `code` int(11) NOT NULL,
  `groups_code` int(11) NOT NULL,
  `courses_code` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `courses_access`
--

INSERT INTO `courses_access` (`code`, `groups_code`, `courses_code`) VALUES
(1, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `courses_structure`
--

CREATE TABLE `courses_structure` (
  `code` int(11) NOT NULL,
  `sequence_number` int(11) NOT NULL,
  `course_code` int(11) NOT NULL,
  `test_code` int(11) DEFAULT NULL,
  `chapter_code` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `courses_structure`
--

INSERT INTO `courses_structure` (`code`, `sequence_number`, `course_code`, `test_code`, `chapter_code`) VALUES
(1, 1, 1, NULL, 3),
(2, 2, 1, NULL, 4),
(3, 3, 1, NULL, 1),
(4, 4, 1, NULL, 2),
(5, 5, 1, 1, NULL),
(6, 6, 1, 2, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `questions_order`
--

CREATE TABLE `questions_order` (
  `code` int(11) NOT NULL,
  `test_code` int(11) NOT NULL,
  `question` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `question_common`
--

CREATE TABLE `question_common` (
  `code` int(11) NOT NULL,
  `test_code` int(11) NOT NULL,
  `question` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `question_common`
--

INSERT INTO `question_common` (`code`, `test_code`, `question`) VALUES
(1, 1, 'На какие классы подразделяются условия труда по степени вредности и (или) опасности?'),
(2, 1, 'Испытательный срок при приеме на работу на не руководящую должность не может превышать:'),
(3, 1, 'Засчитывается ли период временной нетрудоспособности работника в срок испытания, назначенный трудовым договором'),
(4, 1, 'Какое из перечисленных утверждений соответствует требованиям Трудового кодекса Российской Федерации к заключению трудового договора?'),
(5, 1, 'Какое основание является достаточным для расторжения трудового договора по инициативе работодателя в случае неоднократного неисполнения работником трудовых обязанностей без уважительных причин?');

-- --------------------------------------------------------

--
-- Table structure for table `question_common_answers`
--

CREATE TABLE `question_common_answers` (
  `code` int(11) NOT NULL,
  `question_common_code` int(11) NOT NULL,
  `answer` varchar(300) NOT NULL,
  `answer_is_correct` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `question_common_answers`
--

INSERT INTO `question_common_answers` (`code`, `question_common_code`, `answer`, `answer_is_correct`) VALUES
(1, 1, 'На оптимальные, допустимые, вредные и опасные.', 1),
(2, 1, 'На допустимые, вредные, опасные и особо опасные.', 0),
(3, 1, 'На нормальные, оптимальные, вредные и опасные.', 0),
(4, 1, 'На нормальные, допустимые, вредные и экстремальные.', 0),
(5, 2, 'одного месяца', 0),
(6, 2, 'трех месяцев', 1),
(7, 2, 'шести месяцев', 1),
(8, 3, 'Да', 0),
(9, 3, 'Нет', 1),
(10, 4, 'Трудовой договор составляется в двух экземплярах: один в письменной, а другой в электронной форме с усиленной квалифицированной электронной подписью.', 0),
(11, 4, 'Все экземпляры трудового договора передаются для хранения работодателю.', 0),
(12, 4, 'Получение работником экземпляра трудового договора должно подтверждаться подписью работника на экземпляре трудового договора, хранящемся у работодателя.', 1),
(13, 4, 'Трудовой договор может быть оформлен в одном экземпляре при письменном согласии обеих сторон трудовых отношений.', 0),
(14, 5, 'Наличие служебных записок о нарушениях трудовой дисциплины от непосредственного руководителя работника.', 0),
(15, 5, 'Неоднократное неисполнение работником трудовых обязанностей, если он имеет дисциплинарное взыскание.', 1),
(16, 5, 'Видеофиксация систематического невыполнения должностных обязанностей.', 0),
(17, 5, 'Зарегистрированные факты систематических опозданий на работу.', 1);

-- --------------------------------------------------------

--
-- Table structure for table `question_order_answers`
--

CREATE TABLE `question_order_answers` (
  `code` int(11) NOT NULL,
  `question_order_code` int(11) NOT NULL,
  `sequence_answer` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `code` int(11) NOT NULL,
  `group_code` int(11) DEFAULT NULL,
  `full_name` varchar(50) NOT NULL,
  `email` varchar(30) NOT NULL,
  `password` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`code`, `group_code`, `full_name`, `email`, `password`) VALUES
(1, 1, 'Калетин Михаил', 'meviloj@gmail.com', '$2y$10$7M5kC2RcYbiIlzNTlpgdceIaHbbSzJZKShbKUbC9tIBGh3rR4J6WO'),
(2, 1, 'Первый студент', 'student@gmail.com', '$2y$10$O2MmwpCxOJkuoTHD66u5n.PTw/q1yC6Tz.f.9l5hmBLXxbd3AR0d.'),
(21, 1, 'Иванов Иван Иванович', 'ivanov@gmail.com', '$2y$10$pCMjyjtZyGIlUUQtxqWDSu9dSdOvNaXXHzC56HgE7QuZVKgQ3xJ/i');

-- --------------------------------------------------------

--
-- Table structure for table `students_groups`
--

CREATE TABLE `students_groups` (
  `code` int(11) NOT NULL,
  `organization_name` varchar(50) NOT NULL,
  `address` varchar(100) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `students_groups`
--

INSERT INTO `students_groups` (`code`, `organization_name`, `address`, `start_date`, `end_date`) VALUES
(1, 'ООО \"Заваркин\"', 'Оренбургская обл. г. Орск ул. Ленина 42', '2022-04-24', '2022-04-30');

-- --------------------------------------------------------

--
-- Table structure for table `student_article_progress`
--

CREATE TABLE `student_article_progress` (
  `code` int(11) NOT NULL,
  `student_code` int(11) NOT NULL,
  `article_code` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `student_common_answers`
--

CREATE TABLE `student_common_answers` (
  `code` int(11) NOT NULL,
  `answer_code` int(11) NOT NULL,
  `student_code` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `student_common_answers`
--

INSERT INTO `student_common_answers` (`code`, `answer_code`, `student_code`) VALUES
(368, 1, 1),
(369, 6, 1),
(370, 7, 1),
(371, 9, 1),
(372, 13, 1),
(373, 14, 1),
(374, 15, 1);

-- --------------------------------------------------------

--
-- Table structure for table `student_order_answers`
--

CREATE TABLE `student_order_answers` (
  `code` int(11) NOT NULL,
  `answer_code` int(11) NOT NULL,
  `student_code` int(11) NOT NULL,
  `sequence_answer` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `student_test_progress`
--

CREATE TABLE `student_test_progress` (
  `code` int(11) NOT NULL,
  `student_code` int(11) NOT NULL,
  `test_code` int(11) NOT NULL,
  `available` tinyint(1) NOT NULL,
  `correct_answers_percentage` float DEFAULT NULL,
  `test_passed` tinyint(1) DEFAULT NULL,
  `test_start_time` datetime DEFAULT NULL,
  `test_end_time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `student_test_progress`
--

INSERT INTO `student_test_progress` (`code`, `student_code`, `test_code`, `available`, `correct_answers_percentage`, `test_passed`, `test_start_time`, `test_end_time`) VALUES
(1, 1, 1, 0, 60, 1, NULL, NULL),
(2, 2, 1, 1, 50, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tests`
--

CREATE TABLE `tests` (
  `code` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `passing_percentage` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tests`
--

INSERT INTO `tests` (`code`, `name`, `passing_percentage`) VALUES
(1, 'Тест по охране труда', 60),
(2, 'Пиздец тестик', 55);

-- --------------------------------------------------------

--
-- Table structure for table `tests_time`
--

CREATE TABLE `tests_time` (
  `code` int(11) NOT NULL,
  `group_code` int(11) NOT NULL,
  `test_code` int(11) NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tests_time`
--

INSERT INTO `tests_time` (`code`, `group_code`, `test_code`, `start_time`, `end_time`) VALUES
(14, 1, 1, '2022-05-14 02:00:00', '2022-05-14 02:00:00'),
(18, 1, 2, '2022-05-11 02:00:00', '2022-05-11 02:00:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`code`);

--
-- Indexes for table `article`
--
ALTER TABLE `article`
  ADD PRIMARY KEY (`code`),
  ADD KEY `chapter_code` (`chapter_code`);

--
-- Indexes for table `chapters`
--
ALTER TABLE `chapters`
  ADD PRIMARY KEY (`code`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`code`);

--
-- Indexes for table `courses_access`
--
ALTER TABLE `courses_access`
  ADD PRIMARY KEY (`code`),
  ADD KEY `courses_code` (`courses_code`),
  ADD KEY `groups_code` (`groups_code`);

--
-- Indexes for table `courses_structure`
--
ALTER TABLE `courses_structure`
  ADD PRIMARY KEY (`code`),
  ADD KEY `course_code` (`course_code`),
  ADD KEY `test_code` (`test_code`),
  ADD KEY `chapter_code` (`chapter_code`);

--
-- Indexes for table `questions_order`
--
ALTER TABLE `questions_order`
  ADD PRIMARY KEY (`code`),
  ADD KEY `test_code` (`test_code`);

--
-- Indexes for table `question_common`
--
ALTER TABLE `question_common`
  ADD PRIMARY KEY (`code`),
  ADD KEY `test_code` (`test_code`);

--
-- Indexes for table `question_common_answers`
--
ALTER TABLE `question_common_answers`
  ADD PRIMARY KEY (`code`),
  ADD KEY `question_common_code` (`question_common_code`);

--
-- Indexes for table `question_order_answers`
--
ALTER TABLE `question_order_answers`
  ADD PRIMARY KEY (`code`),
  ADD KEY `question_order_code` (`question_order_code`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`code`),
  ADD KEY `group_code` (`group_code`);

--
-- Indexes for table `students_groups`
--
ALTER TABLE `students_groups`
  ADD PRIMARY KEY (`code`);

--
-- Indexes for table `student_article_progress`
--
ALTER TABLE `student_article_progress`
  ADD PRIMARY KEY (`code`),
  ADD KEY `student_code` (`student_code`),
  ADD KEY `article_code` (`article_code`);

--
-- Indexes for table `student_common_answers`
--
ALTER TABLE `student_common_answers`
  ADD PRIMARY KEY (`code`),
  ADD KEY `answer_code` (`answer_code`),
  ADD KEY `student_code` (`student_code`);

--
-- Indexes for table `student_order_answers`
--
ALTER TABLE `student_order_answers`
  ADD PRIMARY KEY (`code`),
  ADD KEY `answer_code` (`answer_code`),
  ADD KEY `student_code` (`student_code`);

--
-- Indexes for table `student_test_progress`
--
ALTER TABLE `student_test_progress`
  ADD PRIMARY KEY (`code`),
  ADD KEY `student_code` (`student_code`),
  ADD KEY `test_code` (`test_code`);

--
-- Indexes for table `tests`
--
ALTER TABLE `tests`
  ADD PRIMARY KEY (`code`);

--
-- Indexes for table `tests_time`
--
ALTER TABLE `tests_time`
  ADD PRIMARY KEY (`code`),
  ADD KEY `group_code` (`group_code`),
  ADD KEY `test_code` (`test_code`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `code` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `article`
--
ALTER TABLE `article`
  MODIFY `code` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `chapters`
--
ALTER TABLE `chapters`
  MODIFY `code` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `code` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `courses_access`
--
ALTER TABLE `courses_access`
  MODIFY `code` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `courses_structure`
--
ALTER TABLE `courses_structure`
  MODIFY `code` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `questions_order`
--
ALTER TABLE `questions_order`
  MODIFY `code` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `question_common`
--
ALTER TABLE `question_common`
  MODIFY `code` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `question_common_answers`
--
ALTER TABLE `question_common_answers`
  MODIFY `code` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `question_order_answers`
--
ALTER TABLE `question_order_answers`
  MODIFY `code` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `code` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `students_groups`
--
ALTER TABLE `students_groups`
  MODIFY `code` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `student_article_progress`
--
ALTER TABLE `student_article_progress`
  MODIFY `code` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `student_common_answers`
--
ALTER TABLE `student_common_answers`
  MODIFY `code` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=375;

--
-- AUTO_INCREMENT for table `student_order_answers`
--
ALTER TABLE `student_order_answers`
  MODIFY `code` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `student_test_progress`
--
ALTER TABLE `student_test_progress`
  MODIFY `code` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tests`
--
ALTER TABLE `tests`
  MODIFY `code` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tests_time`
--
ALTER TABLE `tests_time`
  MODIFY `code` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `article`
--
ALTER TABLE `article`
  ADD CONSTRAINT `article_ibfk_1` FOREIGN KEY (`chapter_code`) REFERENCES `chapters` (`code`);

--
-- Constraints for table `courses_access`
--
ALTER TABLE `courses_access`
  ADD CONSTRAINT `courses_access_ibfk_2` FOREIGN KEY (`courses_code`) REFERENCES `courses` (`code`),
  ADD CONSTRAINT `courses_access_ibfk_3` FOREIGN KEY (`groups_code`) REFERENCES `students_groups` (`code`) ON DELETE CASCADE;

--
-- Constraints for table `courses_structure`
--
ALTER TABLE `courses_structure`
  ADD CONSTRAINT `courses_structure_ibfk_1` FOREIGN KEY (`course_code`) REFERENCES `courses` (`code`),
  ADD CONSTRAINT `courses_structure_ibfk_2` FOREIGN KEY (`test_code`) REFERENCES `tests` (`code`),
  ADD CONSTRAINT `courses_structure_ibfk_3` FOREIGN KEY (`chapter_code`) REFERENCES `chapters` (`code`);

--
-- Constraints for table `questions_order`
--
ALTER TABLE `questions_order`
  ADD CONSTRAINT `questions_order_ibfk_1` FOREIGN KEY (`test_code`) REFERENCES `tests` (`code`);

--
-- Constraints for table `question_common`
--
ALTER TABLE `question_common`
  ADD CONSTRAINT `question_common_ibfk_1` FOREIGN KEY (`test_code`) REFERENCES `tests` (`code`);

--
-- Constraints for table `question_common_answers`
--
ALTER TABLE `question_common_answers`
  ADD CONSTRAINT `question_common_answers_ibfk_1` FOREIGN KEY (`question_common_code`) REFERENCES `question_common` (`code`);

--
-- Constraints for table `question_order_answers`
--
ALTER TABLE `question_order_answers`
  ADD CONSTRAINT `question_order_answers_ibfk_1` FOREIGN KEY (`question_order_code`) REFERENCES `questions_order` (`code`);

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_ibfk_1` FOREIGN KEY (`group_code`) REFERENCES `students_groups` (`code`) ON DELETE CASCADE;

--
-- Constraints for table `student_article_progress`
--
ALTER TABLE `student_article_progress`
  ADD CONSTRAINT `student_article_progress_ibfk_1` FOREIGN KEY (`student_code`) REFERENCES `students` (`code`),
  ADD CONSTRAINT `student_article_progress_ibfk_2` FOREIGN KEY (`article_code`) REFERENCES `article` (`code`) ON DELETE CASCADE;

--
-- Constraints for table `student_common_answers`
--
ALTER TABLE `student_common_answers`
  ADD CONSTRAINT `student_common_answers_ibfk_1` FOREIGN KEY (`answer_code`) REFERENCES `question_common_answers` (`code`),
  ADD CONSTRAINT `student_common_answers_ibfk_2` FOREIGN KEY (`student_code`) REFERENCES `students` (`code`);

--
-- Constraints for table `student_order_answers`
--
ALTER TABLE `student_order_answers`
  ADD CONSTRAINT `student_order_answers_ibfk_1` FOREIGN KEY (`answer_code`) REFERENCES `question_order_answers` (`code`),
  ADD CONSTRAINT `student_order_answers_ibfk_2` FOREIGN KEY (`student_code`) REFERENCES `students` (`code`);

--
-- Constraints for table `student_test_progress`
--
ALTER TABLE `student_test_progress`
  ADD CONSTRAINT `student_test_progress_ibfk_1` FOREIGN KEY (`student_code`) REFERENCES `students` (`code`),
  ADD CONSTRAINT `student_test_progress_ibfk_2` FOREIGN KEY (`test_code`) REFERENCES `tests` (`code`);

--
-- Constraints for table `tests_time`
--
ALTER TABLE `tests_time`
  ADD CONSTRAINT `tests_time_ibfk_1` FOREIGN KEY (`test_code`) REFERENCES `tests` (`code`),
  ADD CONSTRAINT `tests_time_ibfk_2` FOREIGN KEY (`group_code`) REFERENCES `students_groups` (`code`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
