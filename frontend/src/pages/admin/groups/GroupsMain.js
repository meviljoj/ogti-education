import HeaderTitle from "../HeaderTitle";
import {Box} from "@mui/material";
import {Route, Routes} from "react-router-dom";
import GroupsList from "./GroupsList";
import {AdminContext} from "../context/AdminContext";
import {useContext} from "react";
import {ManagerButton} from "../styles/Styles";
import axios from "axios";
import api from "../../../components/api/Api";

const GroupsMain = () => {

    const {setDialogGroup, setDialogGroupData, setDialogGroupOperation} = useContext(AdminContext);

    const AddClick = () => {
        axios.post(api.admin + 'get/groupData.php').then(({data}) => {
            setDialogGroupData(data);
            setDialogGroupOperation('add');
            setDialogGroup();
        });
    }

    return (
        <>
            <HeaderTitle title='Группы обучающихся'/>
            <Box
                sx={{
                    paddingTop: '10px',
                    paddingLeft: '10px',
                    paddingRight: '10px'
                }}
            >
                <ManagerButton onClick={AddClick} variant='contained' sx={{fontSize: '16px', mb: '10px', backgroundColor: '#2B7EB9', '&:hover': {backgroundColor: '#1E5A86'}}}>Добавить группу</ManagerButton>
                <Routes>
                    <Route path='/list' element={<GroupsList/>}/>
                </Routes>
            </Box>
        </>
    )
}

export default GroupsMain;