import * as React from 'react';
import {useState, useEffect, useMemo, useRef} from 'react';
import {createRoot} from 'react-dom/client';
import MapGL, {Source, Layer, GeolocateControl, FullscreenControl, NavigationControl, ScaleControl} from 'react-map-gl';
// import ControlPanel from './control-panel';
import {heatmapLayer} from './map-style';
import {myVariable} from "./datatest"
import { getMapData, getMapDataByUser } from "../../utilities/mapdata-service";
import "./stylesheet.css"
import { useAtomValue } from 'jotai';
import { loginSts, tiers } from '../../../atom';
import ControlPanel from '../MarkerMap/ControlPanel';

const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN; // Set your mapbox token here



export default function HeatMap({selectedPlanner, mapSize}) {
  const mapRef = useRef(null);
// console.log(myVariable)
const [resultss,setResults] = useState("")

console.log(selectedPlanner)
// console.log(resultss)

// const tier = useAtomValue(tiers)
const [currentUser] = useAtomValue(loginSts)


// let data = ""

// eslint-disable-next-line react-hooks/exhaustive-deps
const views = [{latitude: 6, longitude: -104.18},
  // {latitude: 6, longitude: -88.63},
  {latitude: 6, longitude: -68.63},
  // {latitude: 6, longitude: -48.63},
  {latitude: 6, longitude: -28.63},
  {latitude: 6, longitude: -0.63},
  {latitude: 6, longitude: 20.15},
  {latitude: 6, longitude: 40.15},
  {latitude: 6, longitude: 60.15},
  {latitude: 6, longitude: 80.15},
]
  const [viewState , setViewState] = useState(views[1])
console.log(views[0])
const tier = useAtomValue(tiers)
// console.log(tier[3]?.feature[1].style)
const findindex = tier.findIndex(item => item.name === currentUser?.usertype)

useEffect(() => {
  const interval = setInterval(() => {
    // setCounter((prevCounter) => prevCounter + 1);
    console.log("hello")
    console.log(viewState)
    const newLongitude = viewState.longitude + 90; 
    const wrappedLongitude = (newLongitude + 180) % 360 - 180; 
    setViewState({latitude: 6, longitude: wrappedLongitude})
  }, 8000);
  return () => clearInterval(interval);
}, [viewState, views]);

const [mapStyle, setMapStyle] = useState(tier[findindex].feature[0].style)


{/* 6.1722374,104.1825985
6.8837081,-78.6333497
5.3916787,31.1546011 */}

useEffect(() => {
  let ignore = false;
  async function getPlannerList(plannerid) {
    let results = await getMapData(plannerid);
    console.log(results)
    if(!ignore){
    if(results.features !== null)
    {
      console.log("null?")
    setResults(results)
    }
    else{
      console.log("ehre?")
      setResults(myVariable)
    }
  }
  }

  async function getPlanenrListByName(name) {
    let results = await getMapDataByUser(name);
    console.log(results)
    if(!ignore){
    if(results.features !== null)
    {
      console.log("null?")
      setResults(results)
    }
    else{
      console.log("ehre?")
      setResults(myVariable)
    }
  }
  }
console.log(mapStyle)
console.log(selectedPlanner)
  if(selectedPlanner)
  {
    if(selectedPlanner.type === "select")
    {
      console.log(selectedPlanner)
      getPlannerList(selectedPlanner.selected.plannerid)
    }
    else if (selectedPlanner.type === "userheatmap")
    {
      console.log(selectedPlanner)
      const [selectName] = selectedPlanner.selected
      console.log(selectName)
      getPlanenrListByName(selectName.name)
    }
    
  }
  return () => {ignore = true;};
}, []);

const onSelectCity = React.useCallback(({longitude, latitude},zoomlevel) => {
  console.log(longitude, latitude)
  mapRef.current?.flyTo({center: [longitude, latitude], duration: 15000, zoom: zoomlevel});
}, []);

onSelectCity(viewState,0.5)
  return (
    <div style={mapSize}>      
    <MapGL 
        ref={mapRef}
        initialViewState={{
          latitude: 40,
          longitude: -100,
          zoom: 0,
          bearing:10
        }}
        // mapStyle="mapbox://styles/mapbox/dark-v9"
        mapStyle={mapStyle}
        mapboxAccessToken={MAPBOX_TOKEN}
      >

<GeolocateControl position="top-left" />
        <FullscreenControl position="top-left" />
        <NavigationControl position="top-left" />
        <ScaleControl />

{/* 6.1722374,104.1825985
6.8837081,-78.6333497
5.3916787,31.1546011 */}

        {resultss && (
          <Source type="geojson" data={resultss}>
            <Layer {...heatmapLayer} />
          </Source>
        )}
        <ControlPanel tiers={tier[findindex]} setMapStyle={setMapStyle}/>
      </MapGL>
      </div>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function renderToDom(container) {
  createRoot(container).render(<HeatMap />);
}
