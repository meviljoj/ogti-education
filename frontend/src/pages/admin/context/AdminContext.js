import {createContext, useState} from "react";
import axios from "axios";
import api from "../../../components/api/Api";

export const AdminContext = createContext();

export const AdminContextProvider = ({children}) => {

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [refresh, setRefresh] = useState(0);

    const [dialogGroup, stDialogGroup] = useState(false);
    const [dialogGroupData, setDialogGroupData] = useState([]);
    const [dialogGroupOperation, setDialogGroupOperation] = useState();

    const [dialogConfirmation, setDialogConfirmation] = useState(false);


    const [editableCourseCode, setEditableCourseCode] = useState(null);
    const [editableGroupCode, setEditableGroupCode] = useState(null);

    const setOpen = () => {
        setSidebarOpen(!sidebarOpen);
    }

    const setDialogGroup = () => {
        stDialogGroup(!dialogGroup);
    }

    const setConfirm = () => {
        setDialogConfirmation(!dialogConfirmation);
    }

    const deleteCourse = (course_code) => {
        axios.post(api.admin + 'delete/course.php', {course_code}).then(() => {
            setConfirm();
            setRefresh(refresh + 1);
        });
    }

    const deleteGroup = (group_code) => {
        axios.post(api.admin + 'delete/group.php', {group_code}).then(() => {
            setConfirm();
            setRefresh(refresh + 1);
        });
    }

    return (
        <AdminContext.Provider value={{
            sidebarOpen,
            setOpen,
            editableCourseCode,
            setEditableCourseCode,
            dialogGroup,
            setDialogGroup,
            dialogConfirmation,
            setConfirm,
            deleteCourse,
            deleteGroup,
            refresh,
            setRefresh,
            editableGroupCode,
            setEditableGroupCode,
            setDialogGroupData,
            dialogGroupData,
            setDialogGroupOperation,
            dialogGroupOperation
        }}>
            {children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider;