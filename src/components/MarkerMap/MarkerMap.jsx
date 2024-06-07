import * as React from 'react';
import {useState, useMemo, useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import { searchResult } from '../../../atom';
import { useAtomValue } from 'jotai';
// import "../../components/MarkerMap/stylesheet.css"
import { markerDir } from '../../../atom';

// import {MapRef} from 'react-map-gl';

// import {myVariable} from "./datatest"
import Map, {
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl
} from 'react-map-gl';

// import { MapRef } from 'react-map-gl/dist/esm/mapbox/create-ref';

// import ControlPanel from './control-panel';
import Pin from './pin';
import { markerService, processData } from './markermap-service';

import {useRef, useCallback} from 'react';

// import CITIES from './cities.json'
const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN; 

export default function MarkerMap({mapSize, mapData}) {
  const [popupInfo, setPopupInfo] = useState(null);
  // const [data , setData] = useState([])
  const mapRef = useRef(null);

  const data =  mapData && processData(mapData)
console.log(data)
 
  const onSelectCity = useCallback(({longitude, latitude},zoomlevel) => {
    mapRef.current?.flyTo({center: [longitude, latitude], duration: 5000, zoom: zoomlevel});
  }, []);

  markerService(onSelectCity,mapData,data)
  
  const handleCLick = () =>
  {
    console.log("test")
    onSelectCity()
  }


  const pins = useMemo(
    () => data  && data?.map((city, index) => (
        <Marker
          key={`marker-${index}`}
          longitude={city.longitude}
          latitude={city.latitude}
          anchor="bottom"
          onClick={e => {
            e.originalEvent.stopPropagation();
            // console.log("monitor",city)
            setPopupInfo(city);
          }}
        >
          <Pin index={index} type={mapData.type}/>
        </Marker>
      )),
    [data, mapData]
  );
// console.log(popupInfo)
  return (
    <div style={mapSize} >
      <Map
        ref={mapRef}
        initialViewState={{
          latitude: 50,
          longitude: -10,
          zoom: 0,
          bearing: 0,
          pitch: 0
        }}
        mapStyle="mapbox://styles/mapbox/dark-v9"
        mapboxAccessToken={MAPBOX_TOKEN}
        // style={{width: "50vw",height: "500vh"}}
      >
        {/* <GeolocateControl position="top-left" />
        <FullscreenControl position="top-left" />
        <NavigationControl position="top-left" />
        <ScaleControl /> */}

        {(mapData) && pins}
  

        {popupInfo && (
          <Popup
            anchor="top"
            longitude={Number(popupInfo.longitude)}
            latitude={Number(popupInfo.latitude)}
            
            onClose={() => setPopupInfo(null)}
          >
                        {/* <img src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&maxheight=200&photoreference=${item.photo_reference}&key=${TOKEN}`}>
                        </img> */}
            <div>
              {popupInfo.city}, {popupInfo.city} |{' '}
              <a
                target="_new"
                href={`http://en.wikipedia.org/w/index.php?title=Special:Search&search=${popupInfo.city}, ${popupInfo.state}`}
              >
                Wikipedia
              </a>
            </div>
            <img width="100%" src={popupInfo.image} />
          </Popup>
        )}
      </Map>
<div onClick={handleCLick}>test</div>
    </div>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function renderToDom(container) {
  createRoot(container).render(<MarkerMap />);
}
  {/* <ControlPanel /> */}
    {/* </div> */}