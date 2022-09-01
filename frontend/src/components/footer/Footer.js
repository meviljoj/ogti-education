import {Box, Grid, Link, styled, Typography} from "@mui/material";

const DefaultTypography = styled(Typography)({
    color: 'white',
    fontSize: '13px',
    marginBottom: '10px',
});

const HeadingTypography = styled(DefaultTypography)({
    fontSize: '1.08em',
    fontWeight: 'bold',
    lineHeight: '1.1',
    marginBottom: '1.1em',
    marginTop: '20px'
});

const Item = styled(Grid)({
    paddingLeft: '15px',
    paddingRight: '15px'
});

const DefaultLink = styled(Link)({
    color: "white",
    fontSize: '13px',
    marginBottom: '10px',
});

const Footer = () => {
    return (
        <>
            <Box sx={{backgroundColor: '#1E5A86', display: 'flex', justifyContent: 'center'}}>
                <Grid container sx={{width: {xs: '100%', sm: '750px', md: '970px', lg: '1170px'}}}>
                    <Item item xs={12} lg={4}>
                        <HeadingTypography>Орский гуманитарно-технологический институт</HeadingTypography>
                        <DefaultTypography>(филиал) федерального государственного бюджетного образовательного учреждения
                            высшего образования "Оренбургский государственный университет"</DefaultTypography>
                        <DefaultTypography>© 1999 - 2022</DefaultTypography>
                    </Item>
                    <Item item xs={12} lg={4}>
                        <HeadingTypography>Контакты</HeadingTypography>
                        <DefaultTypography><strong><i className="fa fa-map-marker"/> Адрес: </strong>462403, г. Орск,
                            Оренбургская обл.,<br/>пр. Мира, 15а</DefaultTypography>
                        <DefaultTypography><strong><i className="fa fa-phone"/> Телефон: </strong>(3537)
                            23-65-80</DefaultTypography>
                        <DefaultTypography><strong><i className="fa fa-envelope"/> Email: </strong>direktor@ogti.orsk.ru</DefaultTypography>
                        <DefaultTypography sx={{marginBottom: '20px'}}><strong><i className="fa fa-envelope"/> По вопросам деятельности
                            сайта:</strong><br/>web_adm@ogti.orsk.ru</DefaultTypography>
                    </Item>
                    <Item item xs={12} lg={4}>
                        <HeadingTypography>Полезная информация</HeadingTypography>
                        <DefaultTypography><DefaultLink
                            href="http://og-ti.ru/institut/antikorruptsionnaja-politika/antikorruptsionnaja-politika-ogu"><i
                            className="fa fa-fw fa-bullhorn "/> Антикорупционная политика ОГУ</DefaultLink></DefaultTypography>
                        <DefaultTypography><DefaultLink
                            href="http://og-ti.ru/sveden/common"><i className="fa fa-fw fa-briefcase"/> Сведения об образовательной организации</DefaultLink></DefaultTypography>
                        <DefaultTypography><DefaultLink
                            href="http://og-ti.ru/abiturientam/polezno/uchebnye-korpusa"><i
                            className="fa fa-fw fa-compass"/> Учебные корпуса</DefaultLink></DefaultTypography>
                        <DefaultTypography><DefaultLink
                            href="http://og-ti.ru/Abitur"><i className="fa fa-fw fa-sitemap"/> Карта сайта</DefaultLink></DefaultTypography>
                    </Item>
                </Grid>
            </Box>
            <Box sx={{backgroundColor: '#003159'}}>
                <Typography sx={{textAlign: 'center', paddingTop: '10px', paddingBottom: '10px', color: 'white', fontSize: '16px'}}>
                    Платформа онлайн-образования ОГТИ (филиал) ОГУ © 2022
                </Typography>
            </Box>
        </>
    )
}

export default Footer;