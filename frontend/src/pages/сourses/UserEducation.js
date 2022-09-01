import {
    Box, Button,
    Collapse, Divider,
    Grid,
    LinearProgress, Link,
    ListItemButton, ListItemIcon,
    ListItemText,
    styled,
    Tooltip,
    Typography
} from "@mui/material";
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import api from "../../components/api/Api";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import DownloadIcon from '@mui/icons-material/Download';
import '@react-pdf-viewer/core/lib/styles/index.css';
import {useNavigate} from "react-router-dom";
import ReactPdf from "./ReactPdf";
import {UserContext} from "../../components/context/UserContext";

const UserEducation = () => {


    const {courseCode} = useContext(UserContext);
    let navigate = useNavigate();
    const [currentArticle, setCurrentArticle] = useState([]);
    const [oneTime, setOneTime] = useState(0);
    const [chapterIndex, setChapterIndex] = useState();
    const [articleIndex, setArticleIndex] = useState(0);
    const [refreshList, setRefreshList] = useState(1);
    const [articleCode, setArticleCode] = useState(null);
    const [courseInfo, setCourseInfo] = useState(null);
    const [courseCollapse, setCourseCollapse] = useState([]);
    const loginToken = localStorage.getItem('loginToken');
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + loginToken;

    useEffect(() => {
        axios.post(api.user + 'getCourseStructure.php', {'course_code': courseCode}).then(({data}) => {
            setCourseInfo(data);
            if (oneTime === 0) {
                setCourseCollapse(data['course_collapse']);
                setChapterIndex(data['first_chapter_id']);
                setArticleCode(data['course_structure'][data['first_chapter_id']]['articles'][0]['code']);
                setCurrentArticle(data['course_structure'][data['first_chapter_id']]['articles'][0]);
                setOneTime(1);
            }
        });
    }, [refreshList]);

    const StudyDaysProgress = styled(LinearProgress)({
        height: '15px',
        borderRadius: '0px',
        '.MuiLinearProgress-colorPrimary': {backgroundColor: 'white'},
        '.MuiLinearProgress-barColorPrimary': {backgroundColor: '#8dc7ef'},
        '.MuiLinearProgress-bar': {border: '1px solid #c0c0c0'},
    });

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

    const ArticleClick = (chapter_index, article_index, article_code) => {
        setChapterIndex(chapter_index);
        setArticleIndex(article_index);
        setArticleCode(article_code);
        setCurrentArticle(courseInfo['course_structure'][chapter_index]['articles'][article_index]);
    }

    const MainButton = styled(Button)({
        textTransform: 'none',
        backgroundColor: '#349BE3',
        fontWeight: 'bold',
        height: '28px',
        borderRadius: '0px',
        boxShadow: 'none',
        fontSize: '16px',
        '&:hover': {backgroundColor: '#0277BD'}
    })

    const TestClick = (start_time, end_time, test_code, available, test_name) => {
        let currentDate = Date.now() / 1000;
        if (currentDate >= start_time && currentDate <= end_time || available === "1") {
            localStorage.setItem('test_code', test_code);
            localStorage.setItem('test_name', test_name);
            navigate('/courses/test');
        }
    }

    const CompleteClick = () => {
        axios.post(api.user + '/completeLesson.php', {'article_code': articleCode}).then(r => {
            setRefreshList(refreshList + 1);
            let chapter = chapterIndex;
            let article = articleIndex;
            if (article < courseInfo['course_structure'][chapter]['articles'].length - 1) {
                article += 1;
            } else {
                if (chapter < courseInfo['course_structure'].length - 1) {
                    while (true) {
                        chapter += 1;
                        if (courseInfo['course_structure'][chapter]['is_test'] === false) {
                            article = 0;
                            break;
                        }
                    }
                }
            }
            setChapterIndex(chapter);
            setArticleIndex(article);
            setArticleCode(courseInfo['course_structure'][chapter]['articles'][article]['code']);
            setCurrentArticle(courseInfo['course_structure'][chapter]['articles'][article]);
        });
    }

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
                <StudyDaysProgress variant="determinate" value={courseInfo['days_progress']}/>
                <Box sx={{display: 'flex', justifyContent: 'space-between', mb: '10px'}}>
                    {courseInfo['study_days'].map((days) => <Typography
                        sx={{fontSize: '12px'}}>{days}</Typography>)}
                </Box>
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
                                    <ExpandLess/> : <ExpandMore/>}
                            </ListItemButton>
                        </Tooltip>
                        <LinearProgress variant='determinate' value={courseElement['chapter_progress']}/>
                        <Collapse in={courseCollapse[courseElement['element_sequence']]} timeout="auto"
                                  unmountOnExit>
                            {courseElement['articles'].map((article, article_index) =>
                                <Tooltip
                                    title={courseElement['chapter_sequence'] + "." + article['article_sequence'] + " " + article['article_name']}>
                                    <ListItemButton sx={{padding: 0, paddingLeft: '5px'}}
                                                    onClick={() => ArticleClick(chapter_index, article_index, article['code'])}>
                                        <ArticleListText
                                            primary={courseElement['chapter_sequence'] + "." + article['article_sequence'] + " " + article['article_name']}/>
                                        <Divider orientation="vertical" flexItem
                                                 sx={{ml: '2px', borderWidth: '1px'}}/>
                                        <ListItemIcon sx={{
                                            minWidth: '25px',
                                            color: 'green',
                                            display: 'flex',
                                            justifyContent: 'center'
                                        }}>
                                            {article['completed'] === "1" ?
                                                <DoneIcon sx={{color: '#689F38'}}/> : <></>}
                                        </ListItemIcon>
                                    </ListItemButton>
                                </Tooltip>
                            )}
                        </Collapse>
                    </Box> :
                    <Box>
                        <ListItemButton sx={{padding: 0}}
                                        onClick={() => TestClick(courseElement['start_time'], courseElement['end_time'], courseElement['code'], courseElement['available'], courseElement['test_name'])}>
                            <ChapterListText primary={courseElement['test_name']}/>
                            <Divider orientation="vertical" flexItem sx={{ml: '2px', borderWidth: '1px'}}/>
                            <ListItemIcon sx={{
                                minWidth: '25px',
                                color: 'green',
                                display: 'flex',
                                justifyContent: 'center'
                            }}>
                                <Tooltip
                                    title={courseElement['available'] === "0" && courseElement['completed'] !== null ? courseElement['completed'] === "1" ? "Тестирование успешно завершено" : "Вы не набрали достаточное количество правильных ответов" : "Тестирование ещё не доступно или не завершено"}>
                                    {courseElement['available'] === "0" && courseElement['completed'] !== null ? courseElement['completed'] === "1" ?
                                            <DoneIcon sx={{color: '#689F38'}}/> :
                                            <CloseIcon sx={{color: '#D74545'}}/> :
                                        <QuestionMarkIcon sx={{color: '#FBC02D'}}/>}
                                </Tooltip>
                            </ListItemIcon>
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
                                <MainButton sx={{ml: '10px'}} variant='contained'
                                            onClick={CompleteClick}>Завершить</MainButton>
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

export default UserEducation;