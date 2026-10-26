import styled from '@emotion/styled';
import  { useState } from 'react'
import PhotoGallery from './PhotoGallery';
import { Button } from '@mui/material';

const ContentsWrap = styled.div`
  margin: 30px 0;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ImageMoreWrap = styled.div`
  position: relative;
  max-height: ${(props) =>
    props.isMoreView
      ? ''
      : '60vh'}; /* isMoreView 상태가 true일 때는 높이 제한 없이, false일 때는 195px로 작게 보이도록 */
  overflow: hidden;
`;

const WhiteGradientOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    rgba(255, 255, 255, 0) 0%,
    rgb(255, 255, 255) 90%
  );
`;




const GalleryWrap = () => {
    const [isMoreView, setIsMoreView] = useState(false);

    const onClickImageMoreViewButton = () => {
      setIsMoreView(!isMoreView);
    };


  return (
    <>
      <ContentsWrap>
        <ImageMoreWrap isMoreView={isMoreView}>
          {!isMoreView && <WhiteGradientOverlay />}
          <PhotoGallery />
        </ImageMoreWrap>

      </ContentsWrap>
        {!isMoreView && (
          <Button sx={{bgcolor:'#ebebeb81', width:'100%', color:'#000000', fontWeight:'bold'}} size='medium' onClick={onClickImageMoreViewButton}>사진 더보기</Button>
        )}
        {isMoreView && (
            <Button sx={{bgcolor:'#ebebeb81', width:'100%', color:'#000000', fontWeight:'bold'}} size='medium' onClick={onClickImageMoreViewButton}>닫기</Button>
          )
        }    
    </>

    
  )
}

export default GalleryWrap