import {useState} from 'react';
import {Document, Page} from 'react-pdf/dist/esm/entry.webpack';
import {Box, Typography} from "@mui/material";
import {StrongButton} from "../../styled_components/MainStyle";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const ReactPdf = (props) => {
    const [numPages, setNumPages] = useState(1);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({numPages}) {
        setNumPages(numPages);
    }

    const goToPrevPage = () => {
        if (pageNumber > 1) setPageNumber(pageNumber - 1);
    }

    const goToNextPage = () => {
        if (pageNumber < numPages) setPageNumber(pageNumber + 1)
    }

    const loadingDoc = () => {

        setPageNumber(1);

        return (
            <Box sx={{
                height: {xs: '100%', md: '841px'},
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Typography>Пожалуйста подождите</Typography>
            </Box>
        )
    }

    return (
        <>
            <Box sx={{display: 'flex', justifyContent: 'center'}}>
                <Document file={props.pdfSource} onLoadSuccess={onDocumentLoadSuccess}
                          loading={loadingDoc}
                          width='300px'>
                    <Page renderTextLayer={false} pageNumber={pageNumber}/>
                </Document>
            </Box>

            <Box sx={{display: 'flex', justifyContent: 'center', padding: '10px', alignItems: 'center'}}>
                <StrongButton sx={{padding: '0px', minWidth: 'auto', marginRight: '15px'}} onClick={goToPrevPage}>
                    <ArrowBackIosNewIcon sx={{minWidth: '25px', minHeight: '25px'}}/>
                </StrongButton>
                <Typography>{pageNumber + " / " + numPages}</Typography>
                <StrongButton sx={{padding: '0px', minWidth: 'auto', marginLeft: '15px'}} onClick={goToNextPage}>
                    <ArrowForwardIosIcon sx={{minWidth: '25px', minHeight: '25px'}}/>
                </StrongButton>
            </Box>
        </>
    );
};

export default ReactPdf;