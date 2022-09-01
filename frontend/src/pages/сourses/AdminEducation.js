import axios from "axios";
import api from "../../components/api/Api";
import {useNavigate} from "react-router-dom";
import {
    Box,
    Button, Collapse,
    Grid, Link,
    ListItemButton,
    ListItemText,
    styled,
    Tooltip,
    Typography
} from "@mui/material";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ExpandLess from "@mui/icons-material/ExpandLess";
import '@react-pdf-viewer/core/lib/styles/index.css';
import DownloadIcon from "@mui/icons-material/Download";
import {useContext, useEffect, useState} from "react";
import ReactPdf from "./ReactPdf";
import {UserContext} from "../../components/context/UserContext";

const AdminEducation = () => {

    const {courseCode} = useContext(UserContext);
    let navigate = useNavigate();
    const {setTestCode, setTestName} = useContext(UserContext);
    const [oneTime, setOneTime] = useState(0);
    const [currentArticle, setCurrentArticle] = useState([]);
    const [courseInfo, setCourseInfo] = useState(null);
    const [courseCollapse, setCourseCollapse] = useState([]);
    const loginToken = localStorage.getItem('loginToken');
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + loginToken;

    useEffect(() => {
        axios.post(api.admin + 'getCourseStructure.php', {'course_code': courseCode}).then(({data}) => {
            setCourseInfo(data);
            if (oneTime === 0) {
                setCourseCollapse(data['course_collapse']);
                setCurrentArticle(data['course_structure'][data['first_chapter_id']]['articles'][0]);
                setOneTime(1);
            }
        });
    }, [setCourseInfo]);

    const ArticleListText = styled(ListItemText)({
        '.MuiListItemText-primary': {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontSize: '15px'
        }
    })

    const ChapterListText = styled(ArticleListText)({
        '.MuiListItemText-primary': {fontWeight: 'bold', fontSize: '16px'}
    })

    const ArticleClick = (chapter_index, article_index) => {
        setCurrentArticle(courseInfo['course_structure'][chapter_index]['articles'][article_index]);
    }

    const TestClick = (code, name) => {
        setTestCode(code);
        setTestName(name);
        navigate('/courses/test');
    }

    const MainButton = styled(Button)({
        textTransform: 'none',
        backgroundColor: '#349BE3',
        fontWeight: 'bold',
        height: '28px',
        borderRadius: '0px',
        boxShadow: 'none',
        fontSize: '16px',
    })

    const Sidebar = () => {
        return (
            <Box sx={{padding: '10px 15px 10px 15px', maxHeight: '934px', overflow: 'auto'}}>
                <Typography sx={{
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontSize: '24px',
                    lineHeight: '1.4',
                    mb: '5px'
                }}>{courseInfo['name']}</Typography>
                {courseInfo['course_structure'].map((courseElement, chapter_index) => (courseElement['is_test'] === false ?
                    <Box>
                        <Tooltip
                            title={courseElement['chapter_sequence'] + ". " + courseElement['chapter_name']}>
                            <ListItemButton sx={{padding: '0'}} onClick={() => setCourseCollapse({
                                ...courseCollapse,
                                [courseElement['element_sequence']]: !courseCollapse[courseElement['element_sequence']]
                            })}>
                                <ChapterListText
                                    primary={courseElement['chapter_sequence'] + ". " + courseElement['chapter_name']}/>
                                {courseCollapse[courseElement['element_sequence']] === true ?
                                    <ExpandMore/> : <ExpandLess/>}
                            </ListItemButton>
                        </Tooltip>
                        <Collapse in={courseCollapse[courseElement['element_sequence']]} timeout="auto"
                                  unmountOnExit>
                            {courseElement['articles'].map((article, article_index) =>
                                <Tooltip
                                    title={courseElement['chapter_sequence'] + "." + article['article_sequence'] + " " + article['article_name']}>
                                    <ListItemButton sx={{padding: 0, paddingLeft: '5px'}}
                                                    onClick={() => ArticleClick(chapter_index, article_index, article['code'])}>
                                        <ArticleListText
                                            primary={courseElement['chapter_sequence'] + "." + article['article_sequence'] + " " + article['article_name']}/>
                                    </ListItemButton>
                                </Tooltip>
                            )}
                        </Collapse>
                    </Box> :
                    <Box>
                        <ListItemButton sx={{padding: 0}}
                                        onClick={() => TestClick(courseElement['code'], courseElement['test_name'])}>
                            <ChapterListText primary={courseElement['test_name']}/>
                        </ListItemButton>
                    </Box>))}
            </Box>
        )
    }

    return (
        <Box sx={{display: 'flex', justifyContent: 'center'}}>
            <Grid container sx={{minHeight: '600px', width: {sm: '100%', md: '970px', lg: '1170px'}}}>
                <Grid item sx={{width: {xs: '100%', md: '350px'}}}>
                    {courseInfo != null ? <Sidebar/> : <h1>Loading...</h1>}
                </Grid>
                <Grid item sx={{width: {xs: '100%', md: 'calc(100% - 350px)'}, display: 'flex', justifyContent: 'center'}}>
                    <Box sx={{width: '100%'}}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: {xs: 'center', md: 'space-between'},
                            padding: '10px',
                            width: '100%'
                        }}>
                            <Tooltip title={currentArticle['article_name']}>
                                <Typography sx={{
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}>
                                    {currentArticle['article_name']}
                                </Typography>
                            </Tooltip>
                            <Box sx={{display: 'flex'}}>
                                <Link href={'/courses_pdf/' + currentArticle['path_to_pdf']} target="_blank">
                                    <MainButton sx={{minWidth: 'auto', ml: '10px'}}>
                                        <DownloadIcon sx={{color: 'white'}}/>
                                    </MainButton>
                                </Link>
                            </Box>
                        </Box>
                        <Box sx={{width: '100%'}}>
                            <ReactPdf pdfSource={'/courses_pdf/' + currentArticle['path_to_pdf']}/>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}

export default AdminEducation;