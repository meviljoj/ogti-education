import axios from "axios";
import api from "../../../components/api/Api";
import {useNavigate} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {Box, Checkbox, FormControlLabel, FormGroup, Grid, Radio, RadioGroup, Typography} from "@mui/material";
import {StrongButton} from "../../../styled_components/MainStyle";
import {UserContext} from "../../../components/context/UserContext";

const TestAdmin = () => {


    const {testCode, testName} = useContext(UserContext);
    let navigate = useNavigate();
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [questionsBar, setQuestionsBar] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [checkboxValues, setCheckboxValues] = useState([]);
    const [radioButtonValue, setRadioButtonValue] = useState(null);
    const [questions, setQuestions] = useState(null);
    const loginToken = localStorage.getItem('loginToken');
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + loginToken;

    useEffect(() => {
        axios.post(api.admin + 'getTesting.php', {'test_code': testCode}).then(({data}) => {
            if (data[0]['question_type'] === 'multiple') {
                let checkbox = [];

                for (let i = 0; i < data[0]['answers'].length; i++) {
                    checkbox[String(i)] = false;
                }
                setCheckboxValues(checkbox);
            }
            let questionBarArray = [];
            for (let i = 0; i < data.length; i++) {
                let questionBarElement = [];
                questionBarElement["question_number"] = i + 1;
                if (i === 0) questionBarElement["answer_color"] = "blue"
                else questionBarElement["answer_color"] = "white";
                questionBarArray.push(questionBarElement);
            }
            setQuestionsBar(questionBarArray);
            setQuestions(data);
        });
    }, [setQuestions]);

    const NextQuestion = () => {

        let checkboxChecked = false;
        for (let i = 0; i < questions[currentQuestion]['answers'].length; i++) {
            if (checkboxValues[i] === true) checkboxChecked = true;
        }
        if (radioButtonValue === null && !checkboxChecked) return;

        let answer_correct = true;
        if (radioButtonValue != null) {
            if (questions[currentQuestion]['answers'][radioButtonValue]['answer_is_correct'] === "0") answer_correct = false;
        } else {
            for (let i = 0; i < questions[currentQuestion]['answers'].length; i++) {
                if (questions[currentQuestion]['answers'][i]['answer_is_correct'] === "1") {
                    if (checkboxValues[i] === false) answer_correct = false;
                } else {
                    if (checkboxValues[i] === true) answer_correct = false;
                }
            }
        }

        let questionBarArray = questionsBar;
        let questionBarElement = [];
        if (answer_correct) {
            setCorrectAnswers(correctAnswers + 1);
            questionBarElement['question_number'] = currentQuestion + 1;
            questionBarElement['answer_color'] = 'green';
            questionBarArray[currentQuestion] = questionBarElement;
        } else {
            questionBarElement['question_number'] = currentQuestion + 1;
            questionBarElement['answer_color'] = 'red';
            questionBarArray[currentQuestion] = questionBarElement;
        }

        questionBarElement = [];
        questionBarElement['question_number'] = currentQuestion + 2;
        questionBarElement['answer_color'] = 'blue';
        questionBarArray[currentQuestion + 1] = questionBarElement;
        setQuestionsBar(questionBarArray);

        setRadioButtonValue(null);
        setCheckboxValues([]);

        if (currentQuestion + 1 === questions.length) {
            alert('Вы набрали ' + correctAnswers / (currentQuestion + 1) * 100 + '% правильных ответов!');
            navigate('/courses/education');
        } else {
            if (questions[currentQuestion + 1]['question_type'] === 'multiple') {
                let checkbox = [];
                for (let i = 0; i < questions[currentQuestion + 1]['answers'].length; i++) {
                    checkbox[String(i)] = false;
                }
                setCheckboxValues(checkbox);
            }
            setCurrentQuestion(currentQuestion + 1);
        }
    }

    const handleChange = (event) => {
        setCheckboxValues({
            ...checkboxValues,
            [event.target.name]: event.target.checked,
        });
    };

    return (
        <Box sx={{width: '100%', justifyContent: 'center', display: 'flex'}}>
            <Grid container sx={{width: {xs: '100%', sm: '750px', md: '970px', lg: '1170px'}}}>
                <Typography sx={{
                    margin: '10px 0px 10px 5px',
                    fontSize: '30px',
                    fontStyle: 'Italic',
                    fontWeight: 'Bold',
                    wordBreak: 'break-word'
                }}>{testName}</Typography>
                {questions == null ? <h1>Loading...</h1> :
                    <>
                        <Box sx={{justifyContent: 'center', width: '100%', display: 'flex', paddingBottom: '10px'}}>
                            <Box sx={{display: 'flex', overflowX: 'auto'}}>
                                {questionsBar.map((barItem) => (
                                    <Box sx={{ml: '5px', mr: '5px', minHeight: '35px', minWidth: '35px', borderRadius: '5px', border: '1px solid #CBCBCB', backgroundColor: barItem['answer_color'] === 'red' ? '#D74545' : barItem['answer_color'] === 'green' ? '#689F38' : barItem['answer_color'] === 'blue' ? '#2B7EB9' : 'white'}}>
                                        <Typography sx={{textAlign: 'center', lineHeight: '35px', width: '100%', height: '100%', fontSize: '15px'}}>{barItem['question_number']}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                        <Typography sx={{color: '#1D72AD', fontSize: '16px', margin: '10px', fontWeight: 'bold', textAlign: 'center', width: '100%'}}>{questions[currentQuestion]['question_text']}</Typography>
                        <Box sx={{width: '100%', margin: '10px'}}>
                            <Box sx={{backgroundColor: 'white', border: '1px solid #e5e5e5', padding: '10px'}}>
                                {questions[currentQuestion]['question_type'] === 'single' ?
                                    <RadioGroup
                                        value={radioButtonValue}
                                        onChange={(e) => setRadioButtonValue(e.target.value)}
                                    >
                                        {questions[currentQuestion]['answers'].map((answer, index) =>
                                            <FormControlLabel value={index} control={<Radio/>} label={answer['answer_text']}/>
                                        )}
                                    </RadioGroup>
                                    :
                                    <FormGroup>
                                        {questions[currentQuestion]['answers'].map((answer, index) =>
                                            <FormControlLabel control={<Checkbox onChange={handleChange} checked={checkboxValues[answer['answer_code']]} name={index}/>} label={answer['answer_text']}/>
                                        )}
                                    </FormGroup>
                                }
                            </Box>
                            <Box sx={{display: 'flex', justifyContent: 'end', pt: '10px'}}>
                                <StrongButton onClick={NextQuestion}>Следующий вопрос</StrongButton>
                            </Box>
                        </Box>
                    </>}
            </Grid>
        </Box>
    )
}

export default TestAdmin;