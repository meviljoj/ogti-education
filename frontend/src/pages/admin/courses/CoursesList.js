import {useContext, useEffect, useState} from "react";
import {
    Box,
    Divider,
    Grid,
    IconButton,
    Typography
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import Image from "mui-image";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {AdminContext} from "../context/AdminContext";
import LoadingBackdrop from "../LoadingBackdrop";
import ConfirmDialog from "../ConfirmDialog";
import axios from "axios";
import api from "../../../components/api/Api";

const CoursesList = () => {

    let navigate = useNavigate();
    const {setEditableCourseCode, setConfirm, setRefresh, refresh} = useContext(AdminContext);

    const [selectedCourse, setSelectedCourse] = useState(null);
    const [hoveredCourseCode, setHoveredCourseCode] = useState([]);
    const [hoveredCourseTitle, setHoveredCourseTitle] = useState(null);
    const [coursesList, setCoursesList] = useState([]);

    let loginToken = localStorage.getItem('loginToken');
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + loginToken

    const setHovered = (code, title) => {
        setSelectedCourse(code);
        setHoveredCourseCode(code);
        setHoveredCourseTitle(title);
    };

    useEffect(() => {
        axios.post(api.general + 'getCourseList.php').then(({data}) => {
            setCoursesList(data);
            console.log(data);
        });
    }, [refresh]);

    const setEditableCourse = (code) => {
        setEditableCourseCode(code);
        navigate('/admin/courses/edit');
    };

    return (
        <>
            {(coursesList === null ?
                <LoadingBackdrop/>
                :
                <Grid container sx={{justifyContent: {sm: 'center', md: 'start'}}}>
                    {coursesList.map((course) =>
                        <Grid item xs={12} sm={6} md={3} sx={{
                            minWidth: {xs: '95%', sm: '300px'},
                            justifyContent: 'center',
                            display: 'flex',
                            pt: '10px',
                            mb: '10px',
                            padding: '5px'
                        }}
                              onMouseEnter={() => setHovered(course['code'], course['name'])}
                              onMouseLeave={() => setHoveredCourseCode(null)}>
                            <Box sx={{
                                border: '1px solid #E5E5E5',
                                '&:hover': {textDecoration: 'underline'},
                                width: {xs: '100%', sm: '300px'}
                            }}>
                                <Box sx={{
                                    height: '200px',
                                    background: hoveredCourseCode === course['code'] ? `linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), url(${'/logos/' + course['path_to_img']})` : `url(${'/logos/' + course['path_to_img']})`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    margin: '4px',
                                    position: 'relative',
                                }}>
                                    {hoveredCourseCode === course['code'] ?
                                        <Box sx={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            display: 'flex',
                                            justifyContent: 'center',
                                        }}>
                                            <IconButton onClick={() => setEditableCourse(course['code'])}>
                                                <EditIcon sx={{color: '#2B7EB9', minHeight: '35px', minWidth: '35px'}}/>
                                            </IconButton>
                                            <IconButton onClick={setConfirm}>
                                                <DeleteIcon
                                                    sx={{color: '#2B7EB9', minHeight: '35px', minWidth: '35px'}}/>
                                            </IconButton>
                                        </Box> : <></>
                                    }
                                    <Image src={"/logos/" + course['path_to_img']} duration={0} height='200px'
                                           sx={{padding: '5px', zIndex: '-1'}}/>
                                </Box>
                                <Divider sx={{backgroundColor: '#689F38', borderBottomWidth: '3px'}}/>
                                <Typography sx={{
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    fontSize: '18px',
                                    color: '#337ab7'
                                }}>
                                    {course['name']}
                                </Typography>
                            </Box>
                        </Grid>
                    )}
                    <Grid item xs={12} sm={6} md={3}
                          sx={{minWidth: {xs: '95%', sm: '300px'}, minHeight: '200px'}}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                            width: '100%'
                        }}>
                            <IconButton onClick={() => setRefresh(refresh + 1)}>
                                <AddIcon sx={{color: '#2B7EB9', minHeight: '75px', minWidth: '75px'}}/>
                            </IconButton>
                        </Box>
                    </Grid>
                </Grid>)
            }
            <ConfirmDialog title={'Удалить программу обучения'}
                           text={'Вы действительно хотите удалить программу обучения "' + hoveredCourseTitle + '"? Участники потеряют доступ, а структура исчезнет навсегда!'}
                           type={'deleteCourse'} course_code={selectedCourse}/>
        </>
    )
}

export default CoursesList;