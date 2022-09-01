import {Link} from "react-router-dom";
import {trackPromise, usePromiseTracker} from "react-promise-tracker";
import api from "../../components/api/Api";
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {Box, Divider, Grid, Typography} from "@mui/material";
import Image from "mui-image";
import {UserContext} from "../../components/context/UserContext";

const CoursesList = () => {

    const {setCourseCode} = useContext(UserContext);
    const {promiseInProgress} = usePromiseTracker();
    const getAvailableLink = api.general + 'getCourseList.php';
    const loginToken = localStorage.getItem('loginToken');
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + loginToken;
    const [availableCourses, setAvailableCourses] = useState(null);

    useEffect(() => {
        trackPromise(axios.post(getAvailableLink)).then(({data}) => {
            setAvailableCourses(data);
        });
    }, [setAvailableCourses]);

    return (
        <Box sx={{minHeight: '502px', display: 'flex', justifyContent: 'center'}}>
            <Grid container sx={{
                width: {xs: '100%', sm: '750px', md: '970px', lg: '1170px'},
                display: 'block',
                paddingLeft: {xs: '0px', sm: '15px'},
                paddingRight: {xs: '5px', sm: '15px'}
            }}>
                <Typography sx={{
                    margin: '10px 0px 5px 5px',
                    fontSize: '30px',
                    fontStyle: 'Italic',
                    fontWeight: 'Bold'
                }}>Курсы</Typography>
                <Grid container justifyContent="center">
                    {(promiseInProgress === true || availableCourses === null) ? <></> : (
                        <>
                            {availableCourses.map((course) =>
                                <Grid item xs={6} sx={{
                                    minWidth: {xs: '95%', sm: '300px'},
                                    justifyContent: 'center',
                                    display: 'flex',
                                    pt: '10px',
                                    mb: '10px'
                                }} onClick={() => setCourseCode(course['code'])}>
                                    <Box sx={{
                                        border: '1px solid #E5E5E5',
                                        '&:hover': {textDecoration: 'underline'},
                                        width: {xs: '100%', sm: '300px'}
                                    }}>
                                        <Link to="/courses/education"
                                              style={{color: '#337ab7', textDecoration: 'none', width: {xs: '100%'}}}>
                                            <Image src={"/logos/" + course['path_to_img']} duration={0} height='200px'
                                                   sx={{padding: '5px'}}/>
                                            <Divider sx={{backgroundColor: '#689F38', borderBottomWidth: '3px'}}/>
                                            <Typography sx={{
                                                textAlign: 'center',
                                                fontWeight: 'bold',
                                                fontSize: '18px',
                                                color: '#337ab7'
                                            }}>
                                                {course['name']}
                                            </Typography>
                                        </Link>
                                    </Box>
                                </Grid>
                            )}
                        </>
                    )}
                </Grid>
            </Grid>
        </Box>
    )
}

export default CoursesList;