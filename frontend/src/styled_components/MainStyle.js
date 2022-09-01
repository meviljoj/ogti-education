import {Button, IconButton, OutlinedInput, styled} from "@mui/material";

export const StrongButton = styled(Button)({
    borderRadius: '0px',
    backgroundColor: '#349BE3',
    border: 'none',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '14px',
    '&:disabled': {
        backgroundColor: '#349be3d6',
        color: '#F3F3F3',
        border: 'none'
    },
    '&:hover': {
        backgroundColor: '#1E5A86',
        border: 'none'
    },
});

export const StyledIconButton = styled(IconButton)({
    borderRadius: '0px',
    backgroundColor: '#349BE3',
    border: 'none',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '16px',
    '&:disabled': {
        backgroundColor: '#349be3d6',
        color: '#F3F3F3',
        border: 'none'
    },
    '&:hover': {
        backgroundColor: '#1E5A86',
        border: 'none'
    }
})

export const StrongTextField = styled(OutlinedInput)({
    borderRadius: '0px',
})

export default (StrongTextField, StrongButton, StyledIconButton);