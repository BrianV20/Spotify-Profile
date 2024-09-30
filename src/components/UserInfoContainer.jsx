import React, { useContext, useEffect } from "react";
import { UserContext } from "../Contexts";

export default function UserInfoContainer() {
    const user = useContext(UserContext);

    useEffect(() => {
        const token = window.localStorage.getItem("token");
        // console.log("Token:", token);

        if (token) {
            let options = {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const getFollowing = async () => {
                try {
                    const response = await fetch('https://api.spotify.com/v1/me/following?type=artist', options);
                    if (response.status === 403) {
                        console.error("Error 403: Forbidden. Check if the token has the necessary scopes.");
                    }
                    const data = await response.json();
                    console.log(data);
                } catch (error) {
                    console.error("Error fetching following artists:", error);
                }
            };

            getFollowing();
        }
    }, []);

    return (
        <div className="bg-red-200 border-2 border-black flex">
            <div className="border-2 border-blue-400 p-2">
                {user.images != undefined && <img src={user.images[0].url} alt="user profile pic" />}
            </div>
            <div className="border-2 border-green-500 flex-col">
                {user.display_name != undefined && <p className="text-2xl">{user.display_name}</p>}
                <div>
                    {user.followers != undefined && <p>Followers: {user.followers.total}</p>}
                </div>
            </div>
        </div>
    );
}