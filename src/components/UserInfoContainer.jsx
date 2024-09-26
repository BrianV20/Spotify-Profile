import React, { useContext } from "react";
import { UserContext } from "../Contexts";

export default function UserInfoContainer() {
    // const userId = useContext(UserContext.id);
    const user = useContext(UserContext);

    return (
        <div>
            <h2>UserInfoContainer</h2>
            {/* <p>El id: {userId}</p> */}
            {user.images != undefined && <img src={user.images[0].url} alt="user profile pic" />}
            {console.log(user)}
        </div>
    )
};