import {Box, Button, Typography} from "@mui/material";
import {Link, Route, Routes} from "react-router-dom";
import * as React from "react";
import EditStudents from "./EditStudents";
import EditCourse from "../courses/EditCourse";

const EditUsers = () => {
    return (
        <>
            <Box
                sx={{
                    backgroundColor: 'lightgray',
                    height: '55px',
                    alignItems: 'center',
                    display: 'flex',
                    paddingLeft: '10px'
                }}
            >
                <Typography sx={{fontWeight: 'bold', color: '#2B7EB9', fontSize: '18px'}}>
                    Пользователи
                </Typography>
            </Box>

            <Box
                sx={{
                    paddingTop: '10px',
                    paddingLeft: '10px',
                    paddingRight: '10px',
                }}
            >
                <Box display='flex'>
                    <Button variant='contained' sx={{
                        textTransform: 'none', backgroundColor: '#2B7EB9', '&:hover': {
                            backgroundColor: '#1E5A86',
                        }
                    }} component={Link} to='/admin/editUsers/students'>
                        Обучающиеся
                    </Button>
                    <Button variant='contained' sx={{
                        textTransform: 'none', marginLeft: '10px', backgroundColor: '#2B7EB9', '&:hover': {
                            backgroundColor: '#1E5A86',
                        }
                    }} component={Link} to='/admin/editUsers/admins'>
                        Администраторы
                    </Button>
                </Box>
                <Box>
                    <Routes>
                        <Route path='/students' element={<EditStudents/>}/>
                        <Route path='/admins' element={<EditCourse/>}/>
                    </Routes>
                </Box>
            </Box>
        </>
    )
}

export default EditUsers;