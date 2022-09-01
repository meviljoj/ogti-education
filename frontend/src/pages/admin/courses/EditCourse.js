import {useContext} from "react";
import {AdminContext} from "../context/AdminContext";

const EditCourse = () => {

    const {editableCourseCode} = useContext(AdminContext);

    return (
        <>
            {editableCourseCode}
        </>
    )
}

export default EditCourse;