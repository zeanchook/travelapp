import * as React from 'react';
import {useState, useMemo, useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import { searchResult } from '../../../atom';
import { useAtomValue } from 'jotai';
// import "../../components/MarkerMap/stylesheet.css"


// import {myVariable} from "./datatest"
import Map, {
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl
} from 'react-map-gl';

import { markerDir } from '../../../atom';
// import ControlPanel from './control-panel';
import Pin from './pin';

// import CITIES from './cities.json'
const GTOKEN = process.env.GOOGLEMAP_API;
const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN; 

export default function MarkerMap() {
  const [popupInfo, setPopupInfo] = useState(null);
  // const [data , setData] = useState([])
  const searchValue = useAtomValue(searchResult)
  const markerDirection = useAtomValue(markerDir)

  let data = ""

  console.log(markerDirection)

  if(markerDirection.type === "result")
  {
  data  = searchValue && searchValue?.map(item => 
        {
          let image = "" 
          let url = "" 
          if(item.photos)
          {
            const image = item?.photos[Math.floor(Math.random()*item?.photos?.length)].photo_reference
            url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&maxheight=200&photoreference=
          ${image}&key=${GTOKEN}`
          }
          const ob1 = {
            "city": item.name,
            "latitude": item.geometry.location.lat,
            "longitude": item.geometry.location.lng,
            "image": url
        }
          return ob1
        })
  }
  else if(markerDirection.type === "select")
  {
    data = searchValue && searchValue?.filter(item => item.place_id === markerDirection.selected).map(item => 
      {
        let image = "" 
        let url = "" 
        if(item.photos)
        {
          const image = item?.photos[Math.floor(Math.random()*item?.photos?.length)].photo_reference
          url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&maxheight=200&photoreference=
        ${image}&key=${GTOKEN}`
        }
        const ob1 = {
          "city": item.name,
          "latitude": item.geometry.location.lat,
          "longitude": item.geometry.location.lng,
          "image": url
      }
        return ob1
      })
  }
  else if(markerDirection.type === "plannerview")
  {
    console.log(markerDirection)
    data = markerDirection?.selected?.map(item => 
      {
        const ob1 = {
          "city": item.name,
          "latitude": item.locations[0],
          "longitude": item.locations[1],
          "image": "",
          "plannerlocationitemsid": item.plannerlocationitemsid
      }
        return ob1
      }).sort((a,b) => 
      {
        if(a.plannerlocationitemsid > b.plannerlocationitemsid)
          {
              return 1;
          }
          else if(a.plannerlocationitemsid < b.plannerlocationitemsid)
          {
              return -1;
          }
          else{
              return 0;
          }
      })
      console.log(data)
  }
        
       console.log(data)
  const pins = useMemo(
    () => data  && data?.map((city, index) => (
        <Marker
          key={`marker-${index}`}
          longitude={city.longitude}
          latitude={city.latitude}
          anchor="bottom"
          onClick={e => {
            e.originalEvent.stopPropagation();
            console.log("monitor",city)
            setPopupInfo(city);
          }}
        >
          <Pin index={index} type={markerDirection.type}/>
        </Marker>
      )),
    [data, markerDirection.type]
  );
console.log(popupInfo)
  return (
    <div style={{width: "50vw",height: "47vh"}}>
      <Map
        initialViewState={{
          latitude: 50,
          longitude: -10,
          zoom: 3.5,
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

        {(searchValue || data) && pins}
  

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

    </div>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function renderToDom(container) {
  createRoot(container).render(<MarkerMap />);
}
  {/* <ControlPanel /> */}
    {/* </div> */}