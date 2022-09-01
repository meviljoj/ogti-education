import Box from "@mui/material/Box";
import {DataGrid, ruRU} from '@mui/x-data-grid';
import axios from "axios";
import {useEffect, useState} from "react";
import {
    Alert,
    Backdrop,
    Button,
    CircularProgress, IconButton, TextField, Typography
} from "@mui/material";
import * as React from "react";
import studentsColumns from "./studentsColumns";
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {styled} from "@mui/material/styles";
import Api from "../../../components/api/Api";

const ManagerButton = styled(Button)({
    textTransform: 'none',
    width: '110px',
    marginLeft: '10px'
});

const TopFrameBox = styled(Box)({
    color: 'white',
    borderTopLeftRadius: '5px',
    borderTopRightRadius: '5px',
    height: '25px',
    textAlign: 'center'
});

const StudentTextField = styled(TextField)({
    margin: '15px 15px 0px 15px',
    width: '370px'
});

const ActionButton = styled(Button)({
    ml: '15px',
    textTransform: 'none',
    width: '80px',
    color: 'white'
});

const EditStudents = () => {

    const [selectedRows, setSelectedRows] = useState([]);
    const [studentsList, setStudentsList] = useState([]);
    const [frameProps, setFrameProps] = useState(null);
    const [currentUser, setCurrentUser] = useState(0);
    const [selectedRowsLength, setSelectedRowsLength] = useState(0);

    const loginToken = localStorage.getItem('loginToken');
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + loginToken;

    useEffect(() => {
        axios.post(Api.admin + 'getStudents.php').then(({data}) => {
            setStudentsList(data);
        });
    }, [setStudentsList]);

    const showFrame = (frameType) => {
        setFrameProps(frameType);
        setCurrentUser(0);
    }

    const EditStudentFrame = () => {

        const chooseUser = (operation) => {
            if (operation > 0 && currentUser < selectedRowsLength - 1) {
                setCurrentUser(currentUser + operation)
            }
            if (operation < 0 && currentUser > 0) {
                setCurrentUser(currentUser + operation)
            }
        }

        let adduser;
        if (frameProps === null) {
            return (<> </>);
        } else if (frameProps === "Edit" || frameProps === "Delete") {
            adduser = false;
            if (selectedRowsLength === 0) {
                return (
                    <Alert severity="error" action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setFrameProps(null);
                            }}
                        >
                            <CloseIcon/>
                        </IconButton>}
                           sx={{mt: '10px', border: '2px solid #F0625F'}}>
                        Для редактирования (удаления) требуется выбрать пользователя(-ей)!
                    </Alert>)
            }
        }

        return (
            <>
                <Backdrop
                    sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 2}}
                    open={frameProps}
                >
                    <Box sx={{
                        width: '400px',
                        height: '400px',
                        border: '1px solid black',
                        backgroundColor: 'white',
                        borderRadius: '5px'
                    }}>
                        {frameProps === 'Add' ? (
                            <TopFrameBox sx={{backgroundColor: '#2B7EB9'}}>
                                <Typography sx={{lineHeight: '25px'}}>Добавить студента (-ов)</Typography>
                            </TopFrameBox>
                        ) : <></>}
                        {frameProps === 'Edit' ? (
                            <TopFrameBox sx={{backgroundColor: '#689F38'}}>
                                <Typography sx={{lineHeight: '25px'}}>Редактировать студента (-ов)</Typography>
                            </TopFrameBox>
                        ) : <></>}
                        {frameProps === 'Delete' ? (
                            <TopFrameBox sx={{backgroundColor: '#D74545'}}>
                                <Typography sx={{lineHeight: '25px'}}>Удалить студента (-ов)</Typography>
                            </TopFrameBox>
                        ) : <></>}
                        {adduser === false ?
                            <>
                                <Box sx={{display: 'flex', justifyContent: 'center', pt: '10px'}}>
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '50%'
                                    }}>
                                        <IconButton onClick={() => chooseUser(-1)}>
                                            <ArrowBackIcon sx={{'&:hover': {color: 'black'}}}/>
                                        </IconButton>
                                        <Typography sx={{
                                            color: 'gray',
                                            fontSize: '15px'
                                        }}>{currentUser + 1}/{selectedRowsLength}</Typography>
                                        <IconButton onClick={() => chooseUser(+1)}>
                                            <ArrowForwardIcon sx={{'&:hover': {color: 'black'}}}/>
                                        </IconButton>
                                    </Box>
                                </Box>
                                <Box>
                                    {frameProps === "Delete" ? <>
                                            <StudentTextField disabled id="filled-basic" label="Код студента" defaultValue={selectedRows[currentUser]['id']}/>
                                            <StudentTextField disabled id="filled-basic" label="ФИО" defaultValue={selectedRows[currentUser]['full_name']}/>
                                            <StudentTextField disabled id="filled-basic" label="Электронная почта" defaultValue={selectedRows[currentUser]['email']}/>
                                        </> : <>
                                            <StudentTextField id="filled-basic" label="Код студента" defaultValue={selectedRows[currentUser]['id']}/>
                                            <StudentTextField id="filled-basic" label="ФИО" defaultValue={selectedRows[currentUser]['full_name']}/>
                                            <StudentTextField id="filled-basic" label="Электронная почта" defaultValue={selectedRows[currentUser]['email']}/>
                                        </>
                                    }
                                </Box>
                            </>
                            :
                            <Box sx={{paddingTop: '42px', height: '250px'}}>
                                <StudentTextField id="filled-basic" label="Код студента"/>
                                <StudentTextField id="filled-basic" label="ФИО"/>
                                <StudentTextField id="filled-basic" label="Электронная почта"/>
                            </Box>}
                        <Box sx={{display: 'flex', justifyContent: 'center', paddingTop: '80px'}}>
                            <ActionButton onClick={() => setFrameProps(null)} sx={{ml: '0', mr: '15px', backgroundColor: '#8F8F8F', '&:hover': {backgroundColor: '#626262'}}}>
                                Отмена
                            </ActionButton>
                            {frameProps === "Add" ?
                                <ActionButton sx={{backgroundColor: '#2B7EB9', '&:hover': {backgroundColor: '#1E5A86'}}}>
                                    Добавить
                                </ActionButton> : <></>}
                            {frameProps === "Edit" ?
                                <ActionButton sx={{backgroundColor: '#689F38', '&:hover': {backgroundColor: '#4B7824'}}}>
                                    Добавить
                                </ActionButton> : <></>}
                            {frameProps === "Delete" ?
                                <ActionButton sx={{backgroundColor: '#D74545', '&:hover': {backgroundColor: '#B33636'}}}>
                                    Удалить
                                </ActionButton> : <></>}
                        </Box>
                    </Box>
                </Backdrop>
            </>
        )
    }

    return (
        <>
            {(studentsList === null ?
                    <Backdrop
                        sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                        open={true}
                    >
                        <CircularProgress color='inherit'/>
                    </Backdrop>
                    :
                    <>
                        <EditStudentFrame/>
                        <Box sx={{height: '500px', width: '100%', paddingTop: '10px'}}>
                            <DataGrid
                                rows={studentsList}
                                columns={studentsColumns}
                                checkboxSelection
                                localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
                                hideFooterPagination
                                onSelectionModelChange={(e) => {
                                    const selectedIDs = new Set(e);
                                    const selectedRows = studentsList.filter((r) => selectedIDs.has(r.id));
                                    setSelectedRows(selectedRows);
                                    setSelectedRowsLength(selectedRows.length)
                                }}
                            />
                        </Box>  
                        <Box sx={{pt: '10px', justifyContent: 'end', display: {xs: 'block', sm: 'flex'}}}>
                            <ManagerButton sx={{backgroundColor: '#2B7EB9', '&:hover': {backgroundColor: '#1E5A86'}, mt: {xs: '5px', sm: '0px'}}}
                                           variant='contained'
                                           onClick={() => showFrame('Add')}>
                                {'Добавить'}
                            </ManagerButton>
                            <ManagerButton sx={{backgroundColor: '#689F38', '&:hover': {backgroundColor: '#4B7824'}, mt: {xs: '5px', sm: '0px'}}}
                                           variant='contained'
                                           onClick={() => showFrame('Edit')}>
                                {'Редактировать'}
                            </ManagerButton>
                            <ManagerButton sx={{backgroundColor: '#D74545', '&:hover': {backgroundColor: '#B33636'}, mt: {xs: '5px', sm: '0px'}}}
                                           variant='contained'
                                           onClick={() => showFrame('Delete')}>
                                {'Удалить'}
                            </ManagerButton>
                        </Box>
                    </>
            )}
        </>
    )
}

export default EditStudents;