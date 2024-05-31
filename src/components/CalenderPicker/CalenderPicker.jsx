// export default function CalenderPicker()
import React, {useState} from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { useAtom, useAtomValue } from "jotai";
import { currentSelectedRange } from "../../../atom";
import dayjs from "dayjs";


export default function CalenderPicker(){
    const [value, setValue] = useAtom(currentSelectedRange);

    
    const handleValueChange = (newValue) => {
        console.log("newValue:", newValue);
        setValue({...newValue,
            ["default"]: "no"
        })
    }
    
    return (
        <div>
            <Datepicker
                value={value}
                onChange={handleValueChange}
            />
        </div>
    );
}
