import { atom } from "jotai";
import { getUser } from "./src/utilities/users-service";
import { login } from "./src/utilities/users-api";


const loginSts = atom(getUser());
const currentSelectedRange = atom({
    startDate: new Date(),
    endDate: new Date().setMonth(11),
    default: "yes"
})

const searchResult = atom("")

const reload = atom(false);

const markerDir = atom({selected : "" , type: ""})

const tiers = atom([
  {name: "stone", feature: 
  [{name: "dv11",style : "mapbox://styles/mapbox/dark-v11"},  {name: "lv11" ,style: "mapbox://styles/mapbox/light-v11"}],
  style:{borderColor:"black",border:"solid",borderRadius:"10px",
  paddingRight:"4px",paddingLeft:"4px",margin:"5px",fontSize:"12px",backgroundColor:"grey"}
  },
  {name: "silver", feature: [
    {name: "dv11",style : "mapbox://styles/mapbox/dark-v11"},
    {name: "lv11" ,style: "mapbox://styles/mapbox/light-v11"},
  {name: "sv9",style : "mapbox://styles/mapbox/satellite-v9"},
  {name: "sv12" ,style : "mapbox://styles/mapbox/streets-v12"}
  ],
  style:{borderColor:"black",border:"solid",borderRadius:"10px",
  paddingRight:"4px",paddingLeft:"4px",margin:"5px",fontSize:"12px",backgroundColor:"red"}
  },
  {name: "gold", feature: [
    {name: "dv11",style : "mapbox://styles/mapbox/dark-v11"},
    {name: "sv12" ,style : "mapbox://styles/mapbox/streets-v12"},
    {name: "ov12",style : "mapbox://styles/mapbox/outdoors-v12"},
    {name: "standard",style: "mapbox://styles/mapbox/standard"},
    {name: "lv11" ,style: "mapbox://styles/mapbox/light-v11"},
    {name: "sv9",style : "mapbox://styles/mapbox/satellite-v9"},
    {name: "ndv1",style : "mapbox://styles/mapbox/navigation-day-v1"},
    {name: "nnv1",style: "mapbox://styles/mapbox/navigation-night-v1"},
  ],
  style:{borderColor:"black",border:"solid",borderRadius:"10px",
  paddingRight:"4px",paddingLeft:"4px",margin:"5px",fontSize:"12px",backgroundColor:"gold"}
  },
  {name: "admin", feature: [
    {name: "sv12" ,style : "mapbox://styles/mapbox/streets-v12"},
    {name: "ov12",style : "mapbox://styles/mapbox/outdoors-v12"},
    {name: "standard",style: "mapbox://styles/mapbox/standard"},
    {name: "lv11" ,style: "mapbox://styles/mapbox/light-v11"},
    {name: "dv11",style : "mapbox://styles/mapbox/dark-v11"},
    {name: "sv9",style : "mapbox://styles/mapbox/satellite-v9"},
    {name: "ndv1",style : "mapbox://styles/mapbox/navigation-day-v1"},
    {name: "nnv1",style: "mapbox://styles/mapbox/navigation-night-v1"}
  ],
  style:{borderColor:"black",border:"solid",borderRadius:"10px",
  paddingRight:"4px",paddingLeft:"4px",margin:"5px",fontSize:"12px",
  backgroundColor:"green"}
}
]
)




// mapbox://styles/mapbox/light-v11
// mapbox://styles/mapbox/dark-v11




export { loginSts,currentSelectedRange, reload , searchResult , markerDir, tiers };
