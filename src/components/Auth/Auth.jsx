import { useAtomValue } from "jotai"
import { loginSts } from "../../../atom"
import { useLocation, useNavigate } from "react-router-dom"
import AuthPage from "../../pages/AuthPage/AuthPage"

export default function Auth({children})
{
    const currentUser = useAtomValue(loginSts)
    const currentLocation = useLocation();
    const navigate = useNavigate();

    if(currentUser === null)
    {
        return <AuthPage/>
    }
    else if (currentLocation.pathname !== "/auth")
    {
        navigate(currentLocation.pathname)
    }
    else
    {
        navigate("/")
    }
    
    return children
}