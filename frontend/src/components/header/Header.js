import {Box, Container, Grid, Typography} from "@mui/material";
import Image from "mui-image";

const Header = () => {
    return (
        <Box sx={{backgroundColor: 'white'}}>
            <Box sx={{padding: '30px', display: 'flex', justifyContent: 'center'}}>
                <Grid container sx={{width: {xs: '100%', sm: '750px', md: '970px', lg: '1170px'}}}>
                    <Box sx={{display: {xs: 'block', sm: 'flex'}}}>
                        <Box sx={{minWidth: '100px', minHeight: '135px', maxWidth: '100px', maxHeight: '135px', marginRight: '20px'}}>
                            <Image src='/logo.svg' fit='contain' duration={0}/>
                        </Box>
                        <Box>
                            <Typography sx={{
                                fontWeight: 'bold',
                                color: '#29166f',
                                fontSize: '2em',
                                marginTop: '10px',
                                lineHeight: '1.1',
                                marginBottom: '10px'
                            }}>Орский гуманитарно-технологический институт</Typography>
                            <Typography sx={{maxWidth: '625px'}}>(филиал) федерального государственного бюджетного образовательного учреждения
                                высшего
                                образования «Оренбургский государственный университет»</Typography>
                        </Box>
                    </Box>
                </Grid>
            </Box>
        </Box>
    )
}

export default Header;