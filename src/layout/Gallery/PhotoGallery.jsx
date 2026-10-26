import { Gallery, Item } from 'react-photoswipe-gallery';
import 'photoswipe/style.css';
import images from './Images.jsx';
import { useTheme } from '@emotion/react';
import { useMediaQuery } from '@mui/material';

const PhotoGallery = () => {
  const theme = useTheme();

  // 화면 크기에 따라 최대 12개, 중간 7개, 최소 4개의 이미지만 보여줌
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('xl'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.up('sm'));  
  const visibleImages = isLargeScreen ? 7 : isMediumScreen ? 5 : isSmallScreen ? 3 : 2;
  const smallItemStyles = {
      cursor: 'pointer',
      objectFit: 'contain',
      width: '180px',
      height: '270px',
    };
    
  return (
    <Gallery>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${visibleImages}, 0fr)`,
        gridGap: 1,
      }}>
      {images.map((image, index) => {
        return (
            <Item
                key={index}
                cropped
                original={image.source}
                thumbnail={image.source}
                width={image.width}
                height={image.height}>
                {({ ref, open }) => (
                <img
                    style={smallItemStyles}
                    alt={image.alt}
                    src={image.source}
                    ref={ref }
                    onClick={open}
                />
                )}
            </Item>
        );
      })}
    </div>
  </Gallery>
  )
}

export default PhotoGallery