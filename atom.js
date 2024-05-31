import { atom } from "jotai";
import { getUser } from "./src/utilities/users-service";
import { login } from "./src/utilities/users-api";


const loginSts = atom(getUser());
const currentSelectedRange = atom({
    startDate: new Date(),
    endDate: new Date().setMonth(11),
    default: "yes"
})


export { loginSts,currentSelectedRange };
