import { replace } from "formik";
import React from "react";
import { useNavigate } from "react-router-dom";
const Icon = () => {
const navigate=useNavigate();

const handleClick=()=>{
   // window.location.replace("https://csci-term-assignment-k-s.auth.us-east-1.amazoncognito.com/login?client_id=3acb3rqhrl1l834jma43337uht&response_type=code&scope=email+openid+phone&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2FGrid");
   // navigate("https://csci-term-assignment-k-s.auth.us-east-1.amazoncognito.com/signup?client_id=3acb3rqhrl1l834jma43337uht&response_type=code&scope=email+openid+phone&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2FRegister", {replace:true });
    //alert("clicked");
    if(localStorage.getItem("user") && localStorage.getItem("user")!==null && localStorage.getItem("user")!==undefined){
        localStorage.removeItem("user")
        alert("Logged out")
    }
    else{
        navigate("/Login")}
    }



    return (
        <div>
            <div className="icon">
            <img width="50" height="50" src="https://img.icons8.com/ios-filled/50/user.png" alt="user" onClick={handleClick}/>           
                </div>
        </div>
    )
}

export default Icon;