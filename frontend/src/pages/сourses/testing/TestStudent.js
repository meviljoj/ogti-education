import {Box, Checkbox, FormControlLabel, FormGroup, Grid, Radio, RadioGroup, Typography} from "@mui/material";
import axios from "axios";
import api from "../../../components/api/Api";
import {useContext, useEffect, useState} from "react";
import {StrongButton} from "../../../styled_components/MainStyle";
import {useNavigate} from "react-router-dom";
import {UserContext} from "../../../components/context/UserContext";

const TestStudent = () => {

    const {testCode, testName} = useContext(UserContext);
    let navigate = useNavigate();
    const [checkboxValues, setCheckboxValues] = useState([]);
    const [radioButtonValue, setRadioButtonValue] = useState(null);
    const [questionsBar, setQuestionsBar] = useState(null);
    const [questions, setQuestions] = useState(null);
    const [refreshList, setRefreshList] = useState(1);
    const loginToken = localStorage.getItem('loginToken');
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + loginToken;

    useEffect(() => {
        axios.post(api.user + 'getTesting.php', {'test_code': testCode}).then(({data}) => {
            setRadioButtonValue(null);
            setCheckboxValues([]);
            if (data['questions'][0]['question_type'] === 'multiple') {
                let checkbox = [];
                for (let i = 0; i < data['questions'][0]['answers'].length; i++) {
                    checkbox[String(data['questions'][0]['answers'][i]['answer_code'])] = false;
                }
                setCheckboxValues(checkbox);
            }
            setQuestionsBar(data['questions_bar']);
            setQuestions(data['questions']);
        });
    }, [refreshList]);

    const NextQuestion = () => {
        if (radioButtonValue != null) {
            let answer_code = questions[0]['answers'][radioButtonValue]['answer_code'];
            let answer_type = 'single';
            axios.post(api.user + 'completeQuestion.php', {answer_code, answer_type}).then(({r}) => {
                setRefreshList(refreshList + 1);
            });
        } else {
            let answer_type = 'multiple';
            let answer_code = checkboxValues;
            axios.post(api.user + 'completeQuestion.php', {answer_code, answer_type}).then(() => {
                setRefreshList(refreshList + 1);
            });
        }
        if (questions.length === 1) {
            axios.post(api.user + 'completeTest.php', {'test_code': testCode}).then(() => {
                navigate('/courses/education');
            });
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
                {questionsBar == null || questions == null ? <h1>Loading...</h1> :
                    <>
                        <Box sx={{justifyContent: 'center', width: '100%', display: 'flex', paddingBottom: '10px'}}>
                            <Box sx={{display: 'flex', overflowX: 'auto'}}>
                                {questionsBar.map((barItem) => (
                                    <Box sx={{
                                        ml: '5px',
                                        mr: '5px',
                                        minHeight: '35px',
                                        minWidth: '35px',
                                        borderRadius: '5px',
                                        border: '1px solid #CBCBCB',
                                        backgroundColor: barItem['answer_color'] === 'red' ? '#D74545' : barItem['answer_color'] === 'green' ? '#689F38' : barItem['answer_color'] === 'blue' ? '#2B7EB9' : 'white'
                                    }}>
                                        <Typography sx={{
                                            textAlign: 'center',
                                            lineHeight: '35px',
                                            width: '100%',
                                            height: '100%',
                                            fontSize: '15px'
                                        }}>{barItem['question_number']}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                        <Typography sx={{
                            color: '#1D72AD',
                            fontSize: '16px',
                            margin: '10px',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            width: '100%'
                        }}>{questions[0]['question_text']}</Typography>
                        <Box sx={{width: '100%', margin: '10px'}}>
                            <Box sx={{backgroundColor: 'white', border: '1px solid #e5e5e5', padding: '10px'}}>
                                {questions[0]['question_type'] === 'single' ?
                                    <RadioGroup
                                        value={radioButtonValue}
                                        onChange={(e) => setRadioButtonValue(e.target.value)}
                                    >
                                        {questions[0]['answers'].map((answer, index) =>
                                            <FormControlLabel value={index} control={<Radio/>}
                                                              label={answer['answer_text']}/>
                                        )}
                                    </RadioGroup>
                                    :
                                    <>
                                        <FormGroup>
                                            {questions[0]['answers'].map((answer, index) =>
                                                <FormControlLabel control={<Checkbox onChange={handleChange}
                                                                                     checked={checkboxValues[answer['answer_code']]}
                                                                                     name={answer['answer_code']}/>}
                                                                  label={answer['answer_text']}/>
                                            )}
                                        </FormGroup>
                                    </>
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

export default TestStudent;