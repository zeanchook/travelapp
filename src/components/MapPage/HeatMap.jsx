import * as React from 'react';
import {useState, useEffect, useMemo} from 'react';
import {createRoot} from 'react-dom/client';
import MapGL, {Source, Layer} from 'react-map-gl';
// import ControlPanel from './control-panel';
import {heatmapLayer} from './map-style';
import {myVariable} from "./datatest"
import { getMapData } from "../../utilities/mapdata-service";


const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN; // Set your mapbox token here


export default function HeatMap() {
console.log(myVariable)
const [resultss,setResults] = useState("")

useEffect(() => {
  async function getPlannerList() {
    let results = await getMapData();
    console.log(results)
    setResults(results)
  }
  getPlannerList();
}, []);

  return (
    <div style={{maxWidth:"50%",maxHeight:"10px"}}>
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
