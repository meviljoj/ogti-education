import {
    Box,
    Button,
    IconButton,
    ListItemButton,
    ListItemIcon, ListItemText,
    Typography
} from "@mui/material";
import Divider from "@mui/material/Divider";
import * as React from "react";
import {useContext} from "react";
import MenuIcon from '@mui/icons-material/Menu';
import List from "@mui/material/List";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Drawer from "@mui/material/Drawer";
import {useTheme} from "@mui/material/styles";
import {Link} from "react-router-dom";
import StyledAvatar from "./StyledAvatar";
import {UserContext} from "../../../components/context/UserContext";
import {AdminContext} from "../context/AdminContext";
import sidebarElements from "./sidebarElements";

const drawerWidthOpen = 240;
const paddingIconButton = 10;
const marginIconButton = 14;
const iconFontSize = 20;
const drawerWidthClose =
    (paddingIconButton + marginIconButton) * 2 + iconFontSize;

const Sidebar = () => {

    const {setOpen, sidebarOpen} = useContext(AdminContext);
    const {user, logout} = useContext(UserContext);
    const theme = useTheme();

    const navigationClick = () => {
        if (sidebarOpen) setOpen();
    }

    const drawerContent = (
        <>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    height: '42px',
                    width: 'auto',
                    backgroundColor: 'transparent',
                    margin: '14px 14px',
                    padding: '8px 0px',
                    borderBottom: '1px solid lightgray',
                    alignItems: 'flex-end',
                }}
            >
                <Box
                    sx={{
                        flexShrink: 0,
                        display: sidebarOpen ? 'flex' : 'none',
                    }}
                >
                    <img src={"/Logo.svg"} alt="Logo" height="42px" width="42px"/>
                </Box>
                <Typography
                    variant="h1"
                    noWrap={true}
                    gutterBottom
                    sx={{
                        display: {xs: 'none', sm: 'initial'},
                        fontSize: '18px',
                        fontWeight: 600,
                        color: 'white',
                        width: '154px',
                        marginLeft: sidebarOpen ? '8px' : '0px',
                        paddingBottom: '3px',
                    }}
                >
                    ОГТИ
                </Typography>

                <Button
                    onClick={setOpen}
                    sx={{
                        minWidth: 'initial',
                        padding: '10px',
                        color: 'white',
                        borderRadius: '8px',
                        '&:hover': {
                            backgroundColor: '#1E5A86',
                        },
                    }}
                >
                    <MenuIcon
                        sx={{fontSize: '20px', color: 'white'}}
                    />
                </Button>
            </Box>

            <List dense={true}>
                <Divider variant="middle" color="lightgray"/>
                {sidebarElements.map((key, index) => (
                    <ListItemButton
                        sx={{
                            margin: '6px 14px',
                            padding: '10px',
                            borderRadius: '8px',
                            '&:hover': {
                                backgroundColor: '#1E5A86',
                            },
                        }}
                        component={Link}
                        to={key.navigateLink}
                        onClick={navigationClick}
                    >
                        <ListItemIcon sx={{minWidth: '46px', color: 'white'}}>
                            <key.icon sx={{fontSize: '20px'}}/>
                        </ListItemIcon>

                        <ListItemText
                            primary={key.desc}
                            primaryTypographyProps={{
                                variant: 'body2',
                            }}
                            sx={{
                                display: 'inline',
                                margin: '0px',
                                overflowX: 'hidden',
                                color: 'white',
                                whiteSpace: 'nowrap',
                                minWidth: '126px',
                            }}
                        />
                    </ListItemButton>
                ))}
                <Divider variant="middle" color="lightgray"/>
            </List>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    alignContents: 'center',
                    margin: '14px 14px',
                    padding: '12px 4px',
                    borderTop: '1px solid lightgray',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        marginRight: '18px',
                        paddingLeft: '0px',
                        alignItems: 'center',
                        alignContent: 'center',
                    }}
                    onClick={() => setOpen(true)}
                >
                    <StyledAvatar/>
                </Box>
                <Box sx={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>
                    <Typography
                        component="span"
                        variant="body2"
                        sx={{
                            fontFamily: 'inherit',
                            display: 'block',
                            whiteSpace: 'nowrap',
                            lineHeight: 'inherit',
                            fontWeight: 500,
                            color: 'white',
                        }}
                    >
                        {user.full_name}
                    </Typography>
                    <Typography
                        component="span"
                        variant="body2"
                        sx={{
                            display: 'block',
                            whiteSpace: 'nowrap',
                            lineHeight: 'inherit',
                            color: 'white',
                        }}
                    >
                        Администратор
                    </Typography>
                </Box>
                <IconButton contained sx={{color: 'white'}} onClick={logout}>
                    <ExitToAppIcon/>
                </IconButton>
            </Box>
        </>
    );

    return (
        <Drawer
            variant="permanent"
            open={sidebarOpen}
            sx={{
                position: 'fixed',
                width: sidebarOpen
                    ? {xs: '100vw', sm: drawerWidthOpen}
                    : drawerWidthClose,
                height: '100vh',
                '& .MuiDrawer-paper': {
                    position: 'fixed',
                    justifyContent: 'space-between',
                    overflowX: 'hidden',
                    width: sidebarOpen
                        ? {xs: '100vw', sm: drawerWidthOpen}
                        : drawerWidthClose,
                    boxShadow: theme.shadows[8],
                    backgroundColor: '#2B7EB9',
                },
            }}
        >
            {drawerContent}
        </Drawer>
    )
}

export default Sidebar;