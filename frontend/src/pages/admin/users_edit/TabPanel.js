import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {Button, createTheme} from "@mui/material";

function TabPanel(props) {
    const {children, value, index} = props;
    return (
        <div
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
        >
            {value === index && (
                <Box sx={{p: 3}}>
                    {children}
                </Box>
            )}
        </div>
    );
}

export default function BasicTabs() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const theme = createTheme({
        palette: {
            secondary: {
                main: '#2B7EB9',
            },
        },
    });

    return (
        <Box sx={{width: '100%'}}>
            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                <Tabs value={value} onChange={handleChange}>
                    <Tab label="Обучающиеся"/>
                    <Tab label="Администраторы"/>
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>

            </TabPanel>
            <TabPanel value={value} index={1}>

            </TabPanel>
        </Box>
    );
}