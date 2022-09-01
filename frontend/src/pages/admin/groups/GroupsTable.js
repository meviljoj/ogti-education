import {
    Box,
    Collapse,
    IconButton, Paper,
    Table,
    TableBody,
    TableCell, TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {useContext, useState} from "react";
import {AdminContext} from "../context/AdminContext";
import ConfirmDialog from "../ConfirmDialog";
import {ChildrenHeaderCell, GroupCell, HeaderCell, StudentCell} from "../styles/Styles";
import axios from "axios";
import api from "../../../components/api/Api";

const GroupsTable = (props) => {

    const {setConfirm, setDialogGroup, setDialogGroupData, setDialogGroupOperation} = useContext(AdminContext);

    const gridRows = props.data;
    const [groupCode, setGroupCode] = useState(null);
    const [organizationName, setOrganizationName] = useState(null);

    let loginToken = localStorage.getItem('loginToken');
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + loginToken

    const deleteClick = (code, name) => {
        setGroupCode(code);
        setOrganizationName(name);
        setConfirm();
    }

    const editClick = (group_code) => {
        axios.post(api.admin + 'get/groupData.php', {group_code}).then(({data}) => {
            setDialogGroupData(data);
            setDialogGroupOperation('edit');
            setDialogGroup();
        });
    }

    const RowGroup = (props) => {
        const {row} = props;
        const [openGroup, setOpenGroup] = useState(false);

        return (
            <>
                <TableRow sx={{borderBottom: '2px solid #e0e0e0'}}>
                    <TableCell>
                        {row.students.length === 0 ? <></>
                            :
                            <IconButton
                                size="small"
                                onClick={() => setOpenGroup(!openGroup)}
                                sx={{padding: 0}}
                            >
                                {openGroup ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                            </IconButton>
                        }
                    </TableCell>
                    <GroupCell>{row.code}</GroupCell>
                    <GroupCell>{row.name}</GroupCell>
                    <GroupCell>{row.address}</GroupCell>
                    <GroupCell>{row.education_name}</GroupCell>
                    <GroupCell sx={{minWidth: '115px'}}>{row.start_date}</GroupCell>
                    <GroupCell sx={{minWidth: '115px'}}>{row.end_date}</GroupCell>
                    <GroupCell aligh='right'>
                        <Box sx={{display: 'flex', justifyContent: 'center'}}>
                            <IconButton onClick={() =>editClick(row.code)}>
                                <EditIcon sx={{color: '#689F38'}}/>
                            </IconButton>
                            <IconButton onClick={() => deleteClick(row.code, row.name)}>
                                <DeleteIcon sx={{color: '#D74545'}}/>
                            </IconButton>
                        </Box>
                    </GroupCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{padding: 0}} colSpan={12}>
                        <Collapse in={openGroup} timeout="auto" unmountOnExit>
                            <Box>
                                <Typography variant="h5" sx={{textAlign: 'center', lineHeight: '2'}}>
                                    Обучающиеся
                                </Typography>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <ChildrenHeaderCell sx={{width: '20px'}}/>
                                            <ChildrenHeaderCell sx={{width: '20px'}}>№</ChildrenHeaderCell>
                                            <ChildrenHeaderCell sx={{minWidth: '50px'}}>ФИО</ChildrenHeaderCell>
                                            <ChildrenHeaderCell>Электронная почта</ChildrenHeaderCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {row.students.map((student) => (
                                            <RowStudent key={student.name} row={student}/>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </>
        )
    }

    const RowStudent = (props) => {
        const {row} = props;
        const [openStudent, setOpenStudent] = useState(false);

        return (
            <>
                <TableRow key={row.code}>
                    <StudentCell>
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => setOpenStudent(!openStudent)}
                            sx={{padding: 0}}
                        >
                            {openStudent ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                        </IconButton>
                    </StudentCell>
                    <StudentCell sx={{textAlign: 'center'}}>{row.code}</StudentCell>
                    <StudentCell>{row.full_name}</StudentCell>
                    <StudentCell>{row.email}</StudentCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{paddingBottom: 0, paddingTop: 0, border: openStudent ? '2px solid #e0e0e0' : ''}} colSpan={6}>
                        <Collapse in={openStudent} timeout="auto" unmountOnExit>
                            <Box sx={{margin: 1}}>
                                <Typography variant="h6" gutterBottom component="div" sx={{ml: '15px'}}>
                                    Прогресс обучения
                                </Typography>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{width: '150px', border: 'none'}}>Наименование</TableCell>
                                            <TableCell sx={{border: 'none'}}>Завершено</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {row.progress.map((studentProgress) => (
                                            <TableRow key={studentProgress.name}>
                                                <TableCell sx={{border: 'none'}}>{studentProgress.name}</TableCell>
                                                <TableCell sx={{border: 'none'}}>{studentProgress.completed}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </>
        )
    }

    return (
        <>
            {gridRows == null ? <h1>Loading...</h1> :
                <>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead sx={{backgroundColor: '#c0c0c0'}}>
                                <TableRow sx={{}}>
                                    <HeaderCell sx={{width: '20px'}}/>
                                    <HeaderCell sx={{width: '20px'}}>№</HeaderCell>
                                    <HeaderCell sx={{fontSize: '14px', fontWeight: 'bold'}}>Организация</HeaderCell>
                                    <HeaderCell>Адрес</HeaderCell>
                                    <HeaderCell>Программа обучения</HeaderCell>
                                    <HeaderCell>Старт обучения</HeaderCell>
                                    <HeaderCell>Конец обучения</HeaderCell>
                                    <HeaderCell align='right'
                                                sx={{textAlign: 'center', minWidth: '110px'}}>Действия</HeaderCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {gridRows.map((row) => (
                                    <RowGroup key={row.name} row={row}/>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            }
            <ConfirmDialog title={'Удалить программу обучения'}
                           text={'Вы действительно хотите удалить группу обучающихся ' + organizationName + '? Участники потеряют доступ к программе обучения и будут удалены из системы!'}
                           type={'deleteGroup'} group_code={groupCode}/>
        </>
    )
}

export default GroupsTable;