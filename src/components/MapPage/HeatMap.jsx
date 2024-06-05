import * as React from 'react';
import {useState, useEffect, useMemo} from 'react';
import {createRoot} from 'react-dom/client';
import MapGL, {Source, Layer} from 'react-map-gl';
// import ControlPanel from './control-panel';
import {heatmapLayer} from './map-style';
import {myVariable} from "./datatest"
import { getMapData } from "../../utilities/mapdata-service";
import "./stylesheet.css"

const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN; // Set your mapbox token here



export default function HeatMap({selectedPlanner}) {
console.log(myVariable)
const [resultss,setResults] = useState("")
console.log(selectedPlanner)
console.log(resultss)
// let data = ""



useEffect(() => {
  async function getPlannerList(plannerid) {
    let results = await getMapData(plannerid);
    console.log(results)
    setResults(results)
  }
console.log(selectedPlanner)
  if(selectedPlanner)
  {
    console.log(selectedPlanner)
    // console.log(selectedPlanner.select)
    // const { plannerid } = selectedPlanner.select
    getPlannerList(selectedPlanner.selected.plannerid)}
}, [selectedPlanner]);

  return (
    <div style={{width: "50vw",height: "50vh"}}>      
    <MapGL 
        initialViewState={{
          latitude: 40,
          longitude: -100,
          zoom: 3
        }}
        mapStyle="mapbox://styles/mapbox/dark-v9"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        {resultss && (
          <Source type="geojson" data={resultss}>
            <Layer {...heatmapLayer} />
          </Source>
        )}
      </MapGL>
      </div>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function renderToDom(container) {
  createRoot(container).render(<HeatMap />);
}
