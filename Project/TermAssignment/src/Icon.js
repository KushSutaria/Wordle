import React from "react";

const Icon = () => {
const handleClick=()=>{
    //dropdown
    //logout
    //profile
    alert("clicked");
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