import {styled} from "@mui/material/styles";
import {Button, TableCell} from "@mui/material";

export const ManagerButton = styled(Button)({
    textTransform: 'none',
    fontSize: '16px',
    fontWeight: 'bold'
});

export const HeaderCell = styled(TableCell)({
    fontSize: '16px',
    fontWeight: 'bold'
});

export const GroupCell = styled(TableCell)({
    fontSize: '16px'
});

export const ChildrenHeaderCell = styled(TableCell)({
    fontSize: '14px',
    fontWeight: 'bold',
    border: '2px solid #e0e0e0'
});

export const StudentCell = styled(TableCell)({
    border: '2px solid #e0e0e0',
    fontSize: '14px'
});


export default (ManagerButton, HeaderCell, GroupCell, ChildrenHeaderCell, StudentCell);