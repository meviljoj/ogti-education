import {createTheme, ThemeProvider} from "@mui/material";
import Login from "./pages/Login";
import {useContext} from "react";
import {UserContext} from "./components/context/UserContext";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import CoursesMain from "./pages/сourses/CoursesMain";
import AdminMain from "./pages/admin/AdminMain";
import AdminContextProvider from "./pages/admin/context/AdminContext";


const theme = createTheme({
    typography: {
        fontFamily: [
            "'PT Sans'",
            'sans-serif'
        ].join(','),
    }
});

function App() {

    const {user} = useContext(UserContext);

    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Routes>
                    {user ? user.role === 'admin' ? (
                        <>
                            <Route path='/courses/*' element={<CoursesMain/>}/>
                            <Route path='*' element={<Navigate to={'/admin/courses/list'}/>}/>
                            <Route path='/admin/*' element={<AdminContextProvider><AdminMain/></AdminContextProvider>}/>
                        </>
                        ) : (
                        <>
                            <Route path='/courses/*' element={<CoursesMain/>}/>
                            <Route path='*' element={<Navigate to={'/courses/list'}/>}/>
                        </>
                        ) : (
                        <>
                            <Route path='*' element={<Navigate to={'/login'}/>}/>
                            <Route path='/login' element={<Login/>}/>
                        </>
                        )
                    }
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
