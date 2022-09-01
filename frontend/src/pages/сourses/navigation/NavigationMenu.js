import {Link} from "react-router-dom";
import {useContext, useState} from "react";
import {UserContext} from "../../../components/context/UserContext";
import {
    AppBar,
    Avatar,
    Box,
    Button,
    Grid,
    IconButton,
    Menu,
    MenuItem, styled,
    Toolbar,
    Typography,
    Link as Href,
} from "@mui/material";

const NavigationMenu = () => {

    const {user, logout} = useContext(UserContext);
    const [anchorElUser, setAnchorElUser] = useState(null);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const stringAvatar = (name) => {
        if (name === null) {
            return {
                sx: {
                    backgroundColor: 'white',
                    color: '#349BE3',
                    display: {xs: 'none', sm: 'flex'}
                }
            };
        } else {
            return {
                sx: {
                    backgroundColor: 'white',
                    color: '#349BE3',
                    display: {xs: 'flex', sm: 'none'},
                },
                children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
            };
        }
    }

    const NavbarButton = styled(Button)({
        height: '100%',
        lineHeight: '20px',
        fontSize: '18px',
        color: 'white',
        borderRadius: '0',
        '&:hover': {
            backgroundColor: '#0277BD'
        }
    })

    return (
        <>
            <AppBar position="static"
                    sx={{
                        backgroundColor: '#349BE3',
                        height: '66px',
                        display: 'flex',
                        justifyContent: 'center',
                        boxShadow: 'none'
                    }}>
                <Box sx={{display: 'flex', justifyContent: 'center', height: '100%'}}>
                    <Grid container
                          sx={{width: {xs: '100%', sm: '750px', md: '970px', lg: '1170px'}, display: 'block', paddingLeft: {xs: '0px', sm: '15px'}, paddingRight: {xs: '5px', sm: '15px'}}}>
                        <Toolbar disableGutters sx={{height: '100%'}}>
                            <Box sx={{height: '100%', flexGrow: 1, display: {xs: 'flex', md: 'flex'}}}>
                                <Href href='http://og-ti.ru/' underline='none' target="_blank">
                                    <NavbarButton>
                                        ИНСТИТУТ
                                    </NavbarButton>
                                </Href>
                                <NavbarButton component={Link} to="/courses/list">
                                    ОБУЧЕНИЕ
                                </NavbarButton>
                            </Box>

                            <Box sx={{flexGrow: 0, display: {xs: 'none', sm: 'flex'}}}>
                                <Typography textAlign="center"
                                            sx={{paddingRight: '15px', fontSize: "18px"}}>{user.full_name}</Typography>
                            </Box>

                            <Box sx={{flexGrow: 0}}>
                                <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                                    <Avatar {...stringAvatar(null)}/>
                                    <Avatar {...stringAvatar(user.full_name)}/>
                                </IconButton>
                                <Menu
                                    sx={{mt: '53px', '.MuiMenu-list':{margin: 0, padding: 0}, '.MuiMenu-paper':{borderRadius: '0px'}}}
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                    disableGutters
                                >
                                    {user.role === 'admin' ?
                                        <MenuItem disableGutters component={Link} to='/admin/courses/list'>
                                            <Typography textAlign="center" sx={{width: "145px"}}>Администратор</Typography>
                                        </MenuItem> : <></>}
                                    <MenuItem disableGutters onClick={logout}>
                                        <Typography textAlign="center" sx={{width: "145px"}}>Выйти</Typography>
                                    </MenuItem>
                                </Menu>
                            </Box>
                        </Toolbar>
                    </Grid>
                </Box>
            </AppBar>
        </>
    )
}

export default NavigationMenu;