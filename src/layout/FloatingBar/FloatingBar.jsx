import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Button, Stack } from '@mui/material';
import { ArrowCircleUp, ShareOutlined } from '@mui/icons-material';


function FloatingBar({ isVisible }) {
  

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href).then(
      () => {
        alert('주소가 복사되었습니다.😉😉');
      },
      () => {
        alert('주소 복사에 실패했습니다.🥲🥲');
      },
    );
  };



  const handleScroll = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Nav isVisible={isVisible}>
      <Stack>
        <Button onClick={handleScroll}>
          <ArrowCircleUp />
          위로
        </Button>
        <Button onClick={handleCopy}>
          <ShareOutlined />
          공유
        </Button>
        
      </Stack>


    </Nav>
  );
};

FloatingBar.propTypes = {
  isVisible: PropTypes.bool.isRequired,
};

export default FloatingBar;

const Nav = styled.nav`
  min-width: 280px;
  position: fixed;
  bottom: 10px;
  left: 0;
  right: 0;
  align-items: flex-end;
  justify-content: flex-end;
  gap: 5px;
  display: ${(props) => (props.isVisible ? 'flex' : 'none')};
`;
