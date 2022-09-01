import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import {useContext} from "react";
import {AdminContext} from "./context/AdminContext";

const ConfirmDialog = (props) => {

    const {setConfirm, dialogConfirmation, deleteCourse, deleteGroup, refresh, setRefresh} = useContext(AdminContext);

    const confirmDialog = () => {
        if (props.type === 'deleteCourse') {
            deleteCourse(props.course_code);
        }
        if (props.type === 'deleteGroup') {
            deleteGroup(props.group_code);
        }
        setRefresh(refresh + 1);
    }

    return (
        <Dialog
            open={dialogConfirmation}
            onClose={setConfirm}
        >
            <DialogTitle>
                {props.title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {props.text}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={setConfirm}>Отмена</Button>
                <Button onClick={confirmDialog} autoFocus sx={{color: '#D74545'}}>Удалить</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmDialog;