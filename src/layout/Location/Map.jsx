import { Paper } from '@mui/material';
import data from '../../data.json';
import { Container as MapDiv, Marker, NaverMap, useNavermaps } from 'react-naver-maps';

const Map = () => {
  const { lat, lon } = data.mapInfo;
  const navermaps = useNavermaps();

  return (
    <Paper elevation={5}>
      <MapDiv
        style={{
          width: '100%',
          height: '350px',
        }}>
        <NaverMap
          defaultCenter={new navermaps.LatLng(lat, lon)}
          defaultZoom={18}
          draggable={true}
          pinchZoom={true}
          scrollWheel={true}
          keyboardShortcuts={true}>
          <Marker defaultPosition={new navermaps.LatLng(lat, lon)} 
          />
        </NaverMap>
      </MapDiv>
    </Paper>

  );
};

export default Map;
