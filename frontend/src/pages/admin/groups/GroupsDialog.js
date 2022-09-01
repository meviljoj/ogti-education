import {forwardRef, useContext, useState} from "react";
import {
    Autocomplete, Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Select,
    Slide,
    Stack, TextField, Typography
} from "@mui/material";
import {AdminContext} from "../context/AdminContext";
import {DatePicker, DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import ruLocale from 'date-fns/locale/ru';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";
import api from "../../../components/api/Api";

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const GroupsDialog = (props) => {

    const {dialogGroup, setDialogGroup, dialogGroupData, dialogGroupOperation, setRefresh, refresh} = useContext(AdminContext);
    const autocomplete = props.autocomplete['organizations'];
    const study_programs = props.autocomplete['study_programs'];

    const [studentsValues, setStudentsValues] = useState(dialogGroupData.students_values);
    const [values, setValues] = useState(dialogGroupData.group_values);
    const [testsTime, setTestsTime] = useState(dialogGroupData.tests_time);
    const [countStudents, setCountStudents] = useState(dialogGroupData.students_values.length);
    const newStudent = {
        name: '',
        email: ''
    }

    const addStudent = () => {
        let students = studentsValues;
        students.push(newStudent);
        setStudentsValues(students);
        setCountStudents(countStudents + 1);
    }

    const close_dialog = () => {
        setStudentsValues([{name: '', email: ''}]);
        setValues({name: '', input_name: '', address: '', study_program: '', start_date: null, end_date: null})
        setTestsTime([]);
        setCountStudents(0);
        setDialogGroup();
    }

    const confirmClick = () => {
        axios.post(api.admin + 'add/group.php', {'operation': dialogGroupOperation, 'group_values': values, 'tests_time': testsTime, 'students_values': studentsValues}).then(() => {
            setRefresh(refresh + 1);
            close_dialog();
        });
    }

    const Student = (props) => {

        const [studentData, setStudentData] = useState(props.student);
        const student_number = props.index + 1;

        const handleChange = (event) => {
            setStudentData({...studentData, [event.target.name]: event.target.value})
            let student = {};
            if (event.target.name === 'email') {
                student = {name: studentData.name, email: event.target.value}
            } else {
                student = {name: event.target.value, email: studentData.email}
            }
            let students = studentsValues;
            students[props.index] = student;
            setStudentsValues(students);
        }

        const deleteStudent = () => {
            let students = studentsValues;
            let new_students = [];
            for (let i = 0; i < students.length; i++) {
                if (i !== props.index) {
                    new_students.push(students[i])
                }
            }
            setStudentsValues(new_students);
        }

        return (
            <Box sx={{display: {xs: 'block', sm: 'flex'}, justifyContent: 'center', alignItems: 'center'}}>
                <Typography sx={{ml: '10px', textAlign: 'center'}}>{'Студент №' + student_number + ': '}</Typography>
                <Box sx={{display: 'flex', justifyContent: 'center'}}>
                    <TextField sx={{ml: '10px'}} label='Полное имя' name='name' value={studentData['name']} size='small'
                               onChange={handleChange}/>
                    <TextField sx={{ml: '10px', mr: '10px'}} name='email' label='Электронная почта'
                               value={studentData['email']}
                               size='small' onChange={handleChange}/>
                    <IconButton onClick={deleteStudent}>
                        <DeleteIcon sx={{color: '#D74545'}}/>
                    </IconButton>
                </Box>
            </Box>
        )
    }

    const TestTime = (props) => {

        const [timeValues, setTimeValues] = useState(props.time);

        return (
            <Box sx={{pb: '10px'}}>
                <Typography sx={{ml: '10px', textAlign: 'center'}}>{timeValues.test_name}</Typography>
                <Box sx={{display: 'flex', justifyContent: 'center'}}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ruLocale}>
                        <DateTimePicker
                            label='Начало'
                            value={timeValues.start_time}
                            onChange={(newValue) => {
                                console.log(testsTime);
                                console.log(timeValues);
                                setTimeValues({...timeValues, start_time: newValue})
                                let time = {
                                    code: timeValues.code,
                                    start_time: newValue,
                                    end_time: timeValues.end_time,
                                    test_name: timeValues.test_name
                                }
                                let times = testsTime;
                                times[props.index] = time;
                                setTestsTime(times);
                            }}
                            name='start_time'
                            renderInput={(params) => <TextField sx={{ml: '10px'}} size='small' {...params} />}
                        />
                        <DateTimePicker
                            label='Конец'
                            value={timeValues.end_time}
                            onChange={(newValue) => {
                                setTimeValues({...timeValues, end_time: newValue})
                                let time = {
                                    code: timeValues.code,
                                    start_time: timeValues.start_time,
                                    end_time: newValue,
                                    test_name: timeValues.test_name
                                }
                                let times = testsTime;
                                times[props.index] = time;
                                setTestsTime(times);
                            }}
                            name='end_time'
                            renderInput={(params) => <TextField sx={{ml: '10px', mr: '10px'}}
                                                                size='small' {...params} />}
                        />
                    </LocalizationProvider>
                </Box>
            </Box>
        )
    }

    return (
        <Dialog
            open={dialogGroup}
            onClose={close_dialog}
            fullWidth
            TransitionComponent={Transition}
        >
            <DialogTitle sx={{textAlign: 'center'}}>{dialogGroupOperation === 'add' ? 'Добавить группу обучающихся' : 'Редактировать группу обучающихся'}</DialogTitle>
            <DialogContent>
                <Stack spacing={2}>
                    <Autocomplete
                        value={values.name}
                        disableClearable
                        onChange={(event, newValue) => {
                            setValues({...values, name: newValue, address: autocomplete[newValue]});
                        }}
                        inputValue={values.input_name}
                        onInputChange={(event, newInputValue) => {
                            if (newInputValue !== values.name) {
                                setValues({...values, input_name: newInputValue, address: ''})
                            } else {
                                setValues({...values, input_name: newInputValue})
                            }
                        }}
                        freeSolo
                        options={Object.keys(autocomplete).map((name) => name)}
                        renderInput={(params) => <TextField label='Наименование' type='text' autoComplete='off'
                                                            value={values.name} name='name' {...params}
                                                            sx={{mt: '10px'}}/>}
                    />
                    <TextField label='Адрес' value={values.address} onChange={(event) => {
                        setValues({...values, address: event.target.value});
                    }}/>
                    <FormControl>
                        <InputLabel id='study_program_label'>Программа обучения</InputLabel>
                        <Select
                            labelId='study_program_label'
                            value={values.study_program}
                            label='Программа обучения'
                            onChange={(event) => {
                                let index = 0;
                                for (let i = 0; i < study_programs.length; i++) {
                                    if (study_programs[i]['course_code'] === event.target.value) {
                                        index = i;
                                        break;
                                    }
                                }
                                if (event.target.value === dialogGroupData.group_values.code) {
                                    setTestsTime(dialogGroupData.tests_time);
                                } else {
                                    setTestsTime([]);
                                    let newTestsTime = [];
                                    for (let i = 0; i < study_programs[index]['tests'].length; i++) {
                                        newTestsTime.push({
                                            code: study_programs[index]['tests'][i]['code'],
                                            start_time: null,
                                            end_time: null,
                                            test_name: study_programs[index]['tests'][i]['test_name']
                                        })
                                    }
                                    setTestsTime(newTestsTime);
                                }
                                setValues({...values, study_program: event.target.value})
                            }}
                        >
                            {study_programs.map((program, index) => <MenuItem value={program.course_code}>{program.course_name}</MenuItem>)}
                        </Select>
                    </FormControl>
                    {testsTime.length === 0 ? <></> :
                        <Box>
                            <Typography sx={{textAlign: 'center'}}>Время тестирования:</Typography>
                            <Box sx={{backgroundColor: '#f3f3f3', pt: '10px'}}>
                                {testsTime.map((test, index) => (
                                    <TestTime time={testsTime[index]} index={index}/>
                                ))}
                            </Box>
                        </Box>
                    }
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ruLocale}>
                        <DatePicker
                            label='Дата начала'
                            value={values.start_date}
                            onChange={(newValue) => {
                                setValues({...values, start_date: newValue})
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ruLocale}>
                        <DatePicker
                            mask='__.__.____'
                            label='Дата начала'
                            value={values.end_date}
                            onChange={(newValue) => {
                                setValues({...values, end_date: newValue})
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <Typography sx={{textAlign: 'center'}}>Студенты группы</Typography>
                        <IconButton onClick={addStudent} sx={{
                            maxWidth: '25px',
                            maxHeight: '25px',
                        }}>
                            <AddBoxIcon sx={{color: 'green'}}/>
                        </IconButton>
                    </Box>
                    <Box sx={{backgroundColor: '#f3f3f3', pb: '10px'}}>
                        {studentsValues.map((key, index) => (
                            <Box sx={{mt: '10px'}}>
                                <Student student={studentsValues[index]} index={index}/>
                            </Box>
                        ))}
                    </Box>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={close_dialog}>Отмена</Button>
                <Button onClick={confirmClick}>{dialogGroupOperation === 'add' ? 'Добавить' : 'Изменить'}</Button>
            </DialogActions>
        </Dialog>
    )
}

export default GroupsDialog;