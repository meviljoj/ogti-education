import {Box, Typography} from "@mui/material";

const HeaderTitle = (props) => {
    return (
        <Box
            sx={{
                backgroundColor: 'lightgray',
                height: "55px",
                alignItems: "center",
                display: "flex",
                paddingLeft: "10px"
            }}
        >
            <Typography sx={{fontWeight: "bold", color: "#2B7EB9", fontSize: "18px"}}>
                {props.title}
            </Typography>
        </Box>
    )
}

export default HeaderTitle;