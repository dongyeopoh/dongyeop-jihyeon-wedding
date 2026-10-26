import data from '../../data.json';
import { Button, Stack } from '@mui/material';
import { LocationOn, Map } from '@mui/icons-material';


const MapButtons = () => {
  const { naverMap, kakaoMap } = data.mapInfo;

  return (
    <Stack margin='15px 0px' display='flex' direction='row' spacing={3} alignContent='center' justifyContent='center'>
      <Button sx={{bgcolor:'#26be6f', color:'lightcyan', fontWeight:'bold'}} variant='contained' endIcon={<Map/>}  onClick={() => window.open(naverMap)}>Naver Map</Button>
      <Button sx={{bgcolor:'#eff388', color:'blueviolet', fontWeight:'bold'}} variant='contained' endIcon={<LocationOn/>}  onClick={() => window.open(kakaoMap)}>Kakao Map</Button>
    </Stack>
  );
};

export default MapButtons;

