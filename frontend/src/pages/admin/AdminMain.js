import {Route, Routes} from "react-router-dom";
import Sidebar from "./sidebar/Sidebar";
import {Box} from "@mui/material";
import EditUsers from "./users_edit/EditUsers";
import {AdminContext} from "./context/AdminContext";
import {useContext} from "react";
import GroupsMain from "./groups/GroupsMain";
import CoursesMain from "./courses/CoursesMain";

const AdminMain = () => {

    const {sidebarOpen} = useContext(AdminContext);

    return (
        <Box sx={{display: 'flex'}}>
            <Sidebar/>
            <Box sx={{display: sidebarOpen ? {xs: 'none', sm: 'block'} : 'block', paddingLeft: sidebarOpen ? {xs: '0px', sm: '240px'} : '68px', width: '100%'}}>
                <Routes>
                    <Route path='/courses/*' element={<CoursesMain/>}/>
                    <Route path='/users/*' element={<EditUsers/>}/>
                    <Route path='/groups/*' element={<GroupsMain/>}/>
                </Routes>
            </Box>
        </Box>
    )
}

export default AdminMain;