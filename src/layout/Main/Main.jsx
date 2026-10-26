import styled from '@emotion/styled';
import data from '../../data.json';
import mainImg from '../../assets/images/main.jpg';
import { useEffect, useState } from 'react';
import { Paragraph } from '../../components/Text';

const MainImg = styled.img`
  width: 100%;
  height: 100vh; /* 화면 전체 크기 */
  object-fit: cover; /* 이미지가 잘리지 않고 화면에 맞게 조정 */
`;

const Overlay = styled.div`
  position: fixed;
  color: #ffffff;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center ; /* 중앙 정렬 */
  align-items: center;
  background-color: rgba(255, 255, 255, 0.253); /* 흰색 반투명 */
  transition: opacity 0.1s ease-out, transform 0.05s ease-out; /* 즉각적인 반응을 위해 transition 속도 조정 */
  opacity: ${props => props.opacity};
  transform: translateY(${props => props.transform}px); /* Y축 이동 */
  pointer-events: none; /* 오버레이 뒤 요소를 클릭할 수 있도록 함 */
`;

const MainTitle = styled.p`
  font-family: HSSanTokki20-Regular, serif;
  font-size: 2rem;
  color: #2F2120;
  margin: 10px 0 10px 0;
  text-align: center;
`;

const SubTitle = styled.p`
  font-size: 1.2rem;
  color: #2F2120;
  margin: 10px 0 0 0;
  text-align: center;
`;

const Main = () => {
  const { greeting } = data;

  const [opacity, setOpacity] = useState(1);      // 오버레이 투명도
  const [transform, setTransform] = useState(0);  // 오버레이 이동 값
  const [isOverlayVisible, setIsOverlayVisible] = useState(true);  // 오버레이 표시 여부

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;

    // 스크롤에 따라 오버레이가 위로 이동하고 투명도 감소
    const newOpacity = Math.max(1 - scrollTop / windowHeight, 0); 
    const newTransform = Math.min(scrollTop / 2, windowHeight / 2);  // 스크롤 값의 절반만큼 이동
    
    setOpacity(newOpacity);
    setTransform(newTransform);

    // 스크롤이 일정 높이 이상이 되면 오버레이를 완전히 사라지게 함
    if (scrollTop > windowHeight / 1.2) {
      setIsOverlayVisible(false);  // 일정 높이 이상 스크롤 시 오버레이를 숨김
    } else {
      setIsOverlayVisible(true);  // 그 전에는 오버레이를 계속 보임
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div>
      <MainImg src={mainImg} />

      {isOverlayVisible && (  // 오버레이가 보일 때만 렌더링
        <Overlay opacity={opacity} transform={-transform}>
          <Paragraph>{greeting.message}</Paragraph>
          <Paragraph style={{fontSize:'1.1rem'}}>{greeting.owner}</Paragraph>
        </Overlay>
      )}

      {/* 오버레이 아래 텍스트 */}
      <MainTitle>{greeting.detailTitle1}</MainTitle>
      <MainTitle>{greeting.detailTitle2}</MainTitle>
      <SubTitle>{greeting.dday}</SubTitle>
      <SubTitle>{greeting.place}</SubTitle>
    </div>
  );
}

export default Main;
