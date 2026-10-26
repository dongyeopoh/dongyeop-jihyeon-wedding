import { useEffect, useRef, useState } from 'react';
import { Paper } from '@mui/material';
import styled from '@emotion/styled';
import data from '../../data.json';

const MAP_SCRIPT_SRC = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${import.meta.env.VITE_NAVERMAPS_KEY_ID}`;

// 네이버 지도 스크립트를 문서에 한 번만 삽입한다. 이미 있으면 그 로드 완료를 기다리고,
// 이미 로드돼 있으면 바로 onLoad 를 부른다. 반환값은 리스너 해제 함수.
const loadNaverMaps = (onLoad, onError) => {
  if (window.naver?.maps) {
    onLoad();
    return () => {};
  }

  let script = document.querySelector(`script[src="${MAP_SCRIPT_SRC}"]`);
  if (!script) {
    script = document.createElement('script');
    script.src = MAP_SCRIPT_SRC;
    script.async = true;
    document.head.appendChild(script);
  }
  script.addEventListener('load', onLoad);
  script.addEventListener('error', onError);
  return () => {
    script.removeEventListener('load', onLoad);
    script.removeEventListener('error', onError);
  };
};

const Map = () => {
  const { lat, lon } = data.mapInfo;
  const mapRef = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let map = null;

    const destroyMap = () => {
      if (map) {
        map.destroy();
        map = null;
      }
    };

    // 스크립트 로드 실패 또는 인증 실패. 인증 실패는 load 이후에 올 수 있으므로
    // 이미 만든 지도가 있으면 정리한다.
    const fail = () => {
      if (cancelled) return;
      destroyMap();
      setFailed(true);
    };

    const createMap = () => {
      if (cancelled || map || !mapRef.current || !window.naver?.maps) return;
      const { naver } = window;
      const position = new naver.maps.LatLng(lat, lon);
      map = new naver.maps.Map(mapRef.current, {
        center: position,
        zoom: 18,
        draggable: true,
        pinchZoom: true,
        scrollWheel: true,
        keyboardShortcuts: true,
      });
      new naver.maps.Marker({ position, map });
    };

    // 인증 실패 콜백은 스크립트 로드 전에 등록해야 한다.
    window.navermap_authFailure = fail;
    const unlisten = loadNaverMaps(createMap, fail);

    return () => {
      cancelled = true;
      unlisten();
      if (window.navermap_authFailure === fail) delete window.navermap_authFailure;
      destroyMap();
    };
  }, [lat, lon]);

  return (
    <Paper elevation={5}>
      <MapBox>
        {failed
          ? <FailMessage>지도를 불러오지 못했습니다. 아래 약도를 참고해 주세요.</FailMessage>
          : <div ref={mapRef} style={{ width: '100%', height: '100%' }} />}
      </MapBox>
    </Paper>
  );
};

export default Map;

const MapBox = styled.div`
  width: 100%;
  height: 350px;
`;

const FailMessage = styled.p`
  margin: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 16px;
  font-size: 14px;
  color: #555;
`;
