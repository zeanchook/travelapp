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

const markerDir = atom({selected : "" , type: "result"})


export { loginSts,currentSelectedRange, reload , searchResult , markerDir };
