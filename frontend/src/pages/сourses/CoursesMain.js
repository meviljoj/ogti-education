import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import NavigationMenu from "./navigation/NavigationMenu";
import {Route, Routes} from "react-router-dom";
import CoursesList from "./CoursesList";
import AdminEducation from "./AdminEducation";
import {UserContext} from "../../components/context/UserContext";
import UserEducation from "./UserEducation";
import {useContext} from "react";
import TestAdmin from "./testing/TestAdmin";
import TestStudent from "./testing/TestStudent";

const CoursesMain = () => {

    const {user} = useContext(UserContext);

    return (
        <>
            <Header/>
            <NavigationMenu/>
            <Routes>
                <Route path='/list' element={<CoursesList/>}/>
                <Route path='/test' element={user.role === 'admin' ? <TestAdmin/> : <TestStudent/>}/>
                <Route path='/education' element={user.role === 'admin' ? <AdminEducation/> : <UserEducation/>}/>
            </Routes>
            <Footer/>
        </>
    )
}

export default CoursesMain;