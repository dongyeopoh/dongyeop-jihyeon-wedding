import { useEffect, useRef, useState } from 'react';
import './App.css';
import { Box, Container, Grid2, styled, ThemeProvider } from '@mui/material';
import Main from './layout/Main/Main';
import { Heading1 } from './components/Text';
import Invitation from './layout/Invitation/Invitation';
import GalleryWrap from './layout/Gallery/GalleryWrap';
import Location from './layout/Location/Location';
import FloatingBar from './layout/FloatingBar/FloatingBar';
import Footer from './layout/Footer/Footer';

import Calendar from './layout/Calendar/Calendar';
import { theme } from './theme';
import Comment from './layout/Comment/Comment';


const Wrapper = styled(Box)({
  color: '#222',
  padding: '30px 0px'
})

function App() {
  const [isVisible, setIsVisible] = useState(false);
  const galleryRef = useRef(null);

  useEffect(() => {
    window.addEventListener('scroll', checkScrollPosition);
    return () => {
      window.removeEventListener('scroll', checkScrollPosition);
    };
  }, []);

  const checkScrollPosition = () => {
    if (galleryRef.current) {
      const { offsetTop } = galleryRef.current;
      const scrollPosition = window.scrollY;

      if (scrollPosition >= offsetTop) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    }
  };  

  return (
    <>
      <ThemeProvider theme={theme("light")}>
        <Container maxWidth="xl">
          <Box>
            <Main />
          </Box>
          <Wrapper>
            <Heading1>모시는 글</Heading1>
            <Grid2 sx={{justifyContent:'center'}}
                    container>
              <Invitation />
              <Calendar/>            
            </Grid2>
          </Wrapper>
          <Wrapper ref={galleryRef}>
            <Heading1>Gallery</Heading1>
            <GalleryWrap />
          </Wrapper>
          <Wrapper>
            <Heading1>오시는 길</Heading1>
            <Location />
          </Wrapper>
          <Wrapper>
            <Heading1>방명록</Heading1>
            <Comment/>
          </Wrapper>
          <FloatingBar isVisible={isVisible} />
        </Container>
        <Footer description='축하해주셔서 감사합니다.'/>
      </ThemeProvider>
    </>
  )
}

export default App
