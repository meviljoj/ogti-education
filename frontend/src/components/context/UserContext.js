import {createContext, useState, useEffect} from 'react'
import axios from 'axios'
import api from "../api/Api";

export const UserContext = createContext();

export const Axios = axios.create({
    baseURL: api.general,
});

export const UserContextProvider = ({children}) => {

    const [theUser, setUser] = useState(null);
    const [wait, setWait] = useState(false);
    const [testCode, setTestCode] = useState(null);
    const [testName, setTestName] = useState(null);
    const [courseCode, setCourseCode] = useState(null);

    const registerUser = async ({full_name,email,password}) => {
        setWait(true);
        try{
            const {data} = await Axios.post('register.php',{
                full_name,
                email,
                password
            });
            setWait(false);
            return data;
        }
        catch(err){
            setWait(false);
            return {success:0, message:'Ошибка соединения с сервером!'};
        }
    }

    const loginUser = async ({email,password}) => {
        setWait(true);
        try{
            const {data} = await Axios.post('login.php',{
                email,
                password
            });
            if(data.success && data.token){
                localStorage.setItem('loginToken', data.token);
                localStorage.setItem('email', email);
                localStorage.setItem('user_id', data.user_id);
                setWait(false);
                return {success:1};
            }
            setWait(false);
            return {success:0, message:data.message};
        }
        catch(err){
            setWait(false);
            return {success:0, message:'Ошибка соединения с сервером!'};
        }

    }

    const loggedInCheck = async () => {
        const loginToken = localStorage.getItem('loginToken');
        Axios.defaults.headers.common['Authorization'] = 'Bearer '+loginToken;
        if(loginToken){
            const {data} = await Axios.get('getUser.php');
            if(data.success && data.user){
                setUser(data.user);
                return;
            }
            setUser(null);
        }
    }

    useEffect(() => {
        async function asyncCall(){
            await loggedInCheck();
        }
        asyncCall();
    },[]);

    const logout = () => {
        localStorage.removeItem('loginToken');
        setUser(null);
    }

    return (
        <UserContext.Provider value={{registerUser,loginUser,wait, user:theUser,loggedInCheck,logout, setTestCode, testCode, testName, setTestName, setCourseCode, courseCode}}>
            {children}
        </UserContext.Provider>
    );

}

export default UserContextProvider;