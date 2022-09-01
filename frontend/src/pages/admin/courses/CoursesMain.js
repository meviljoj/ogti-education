import HeaderTitle from "../HeaderTitle";
import {Box} from "@mui/material";
import {Route, Routes} from "react-router-dom";
import CoursesList from "./CoursesList";
import EditCourse from "./EditCourse";

const CoursesMain = () => {
    return (
        <>
            <HeaderTitle title="Редактировать курсы"/>
            <Box
                sx={{
                    paddingTop: '10px',
                    paddingLeft: '10px',
                    paddingRight: '10px'
                }}
            >
                <Routes>
                    <Route path='/list' element={<CoursesList/>}/>
                    <Route path='/edit' element={<EditCourse/>}/>
                </Routes>
            </Box>
        </>
    )
}

export default CoursesMain;