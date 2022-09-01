import {
    Box,
    FormControl,
    IconButton,
    InputAdornment, InputLabel,
    styled,
    Typography
} from "@mui/material";
import {useContext, useState} from "react";
import {UserContext} from "../components/context/UserContext";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import StrongButton, {StrongTextField} from "../styled_components/MainStyle";

const DefaultTypography = styled(Typography)({
    color: '#23527C',
    textAlign: 'center'
});


const Login = () => {

    const {loginUser, loggedInCheck} = useContext(UserContext);
    const [errMsg, setErrMsg] = useState(false);
    const [validEmail, setValidEmail] = useState(true);
    const [buttonActive, setButtonActive] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (prop) => (event) => {
        setFormData({...formData, [prop]: event.target.value});
        if (prop === 'email') {
            if (event.target.value.length === 0) setValidEmail(true)
            else {
                if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(event.target.value)) {
                    setValidEmail(true);
                    if (formData.password.length > 8) setButtonActive(true);
                } else {
                    setValidEmail(false);
                    setButtonActive(false);
                }
            }
        } else {
            if (event.target.value.length > 8 && validEmail) setButtonActive(true)
            else setButtonActive(false);
        }
    };

    const submitForm = async (e) => {
        e.preventDefault();

        if (!Object.values(formData).every(val => val.trim() !== '')) {
            setErrMsg('Все поля должны быть заполнены!');
            return;
        }

        const data = await loginUser(formData);
        if (data.success) {
            e.target.reset();
            await loggedInCheck();
            return;
        }
        setErrMsg(data.message);
    }

    return (
        <>
            <Header/>
            <Box sx={{height: {xs: '420px', sm: '900px'}, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Box sx={{width:  {xs: '95%', sm: '400px'}, height: '400px', backgroundColor: 'white'}}>
                    <form onSubmit={submitForm}>
                        <DefaultTypography sx={{fontWeight: 'bold', fontSize: {xs: '36px', sm: '48px'}, paddingTop: '65px'}}>
                            Здравствуйте!
                        </DefaultTypography>
                        <DefaultTypography sx={{fontSize: '18px', paddingTop: '3px'}}>
                            Войдите в свою учетную запись
                        </DefaultTypography>
                        <Box sx={{display: 'flex', justifyContent: 'center', paddingTop: '15px'}}>
                            <FormControl variant='outlined' size='small' sx={{m: 1, width: '70%'}}>
                                <InputLabel htmlFor='outlined-email'>Электронная почта</InputLabel>
                                <StrongTextField id='outlined-email' label='Электронная почта' type='Email'
                                                 error={!validEmail} value={formData.email}
                                                 onChange={handleChange('email')}/>
                            </FormControl>
                        </Box>
                        <Box sx={{display: 'flex', justifyContent: 'center', paddingTop: '15px'}}>
                            <FormControl variant='outlined' size='small' sx={{m: 1, width: '70%'}}>
                                <InputLabel htmlFor='outlined-password'>Пароль</InputLabel>
                                <StrongTextField
                                    label='Пароль'
                                    id='outlined-password'
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleChange('password')}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                 aria-label="toggle password visibility"
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                 {showPassword ? <VisibilityOff/> : <Visibility/>}
                                            </IconButton>
                                        </InputAdornment>
                                    }/>
                            </FormControl>
                        </Box>
                        <Box sx={{display: 'flex', justifyContent: 'center', paddingTop: '15px'}}>
                            <StrongButton sx={{fontSize: '12px'}} type='submit' variant='outlined' disabled={!buttonActive} children='ВОЙТИ'/>
                        </Box>
                    </form>
                </Box>
            </Box>
            <Footer/>
        </>
    )
}

export default Login;