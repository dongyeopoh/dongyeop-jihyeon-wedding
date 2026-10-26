import styled from '@emotion/styled';
import data from '../../data.json';
import Address from './Address.jsx';
import Map from './Map.jsx';
import MapButtons from './MapButtons.jsx';
import { Caption, PointTitle } from '../../components/Text.jsx';
import directionsImg from '../../assets/images/direction.png';
import { Container, Paper } from '@mui/material';

const DirectionsImg = styled.img`
  width: 100%;
  height: 100%; /* 화면 전체 크기 */
`;

const Location = () => {
  const { mapInfo } = data;
  return (
    <LocationWrapper>
      <Container maxWidth='md'>
        <PointTitle>{mapInfo.address1}</PointTitle>
        <Caption textAlign={'center'}>{mapInfo.address2}</Caption>
        <Map />
        <MapButtons />
        <PointTitle style={{textAlign:'left'}}>{'\uD83D\uDCCD 약도'}</PointTitle>
        <Paper elevation={5}
              sx={{margin: '20px 0 0 0'}}>
          <DirectionsImg src={directionsImg}/>
        </Paper>
        <Address />
      </Container>
    </LocationWrapper>
  );
};

export default Location;

const LocationWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
