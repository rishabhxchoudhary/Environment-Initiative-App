import { useEffect } from "react";
import useCustomNavigate from "../../hooks/useCustomNavigate";
import { useAppSelector } from "../../store";
import Login from "./LoginPage";


const LoginPageContainer = () => {

    const navigate = useCustomNavigate();

    const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

    /* If the user is logged in navigate to home */
    useEffect(() => {
        if(isLoggedIn){
            navigate("/", false);
        }
    },  [navigate, isLoggedIn])
    return (
        <Login/>
    )
}

export default LoginPageContainer;