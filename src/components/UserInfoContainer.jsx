import React, { useContext, useEffect } from "react";
import { UserContext } from "../Contexts";

export default function UserInfoContainer() {
    // const userId = useContext(UserContext.id);
    const user = useContext(UserContext);

    useEffect(() => {

        if(window.localStorage.getItem("token")){
            let options = {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${window.localStorage.getItem("token")}`,
                },
            };
            
            const getFollowing = async () => {
                try{
                    const response = await fetch('https://api.spotify.com/v1/me/following?type=artist', options);
                    const data = await response.json();
                    console.log(data);
                } catch(error){
                    console.error("Error por alguna razón: ", error);
                }
            };
    
            getFollowing();
        }
    }, []);

    return (
        <div className="bg-red-200 border-2 border-black flex">
            {/* <h2>UserInfoContainer</h2> */}
            {/* <p>El id: {userId}</p> */}
            <div className="border-2 border-blue-400 p-2">
                {user.images != undefined && <img src={user.images[0].url} alt="user profile pic" />}
            </div>
            <div className="border-2 border-green-500 flex-col">
                {user.display_name != undefined && <p className="text-2xl">{user.display_name}</p>}
                <div>
                    {user.followers != undefined && <p>Followers: {user.followers.total}</p>}
                </div>
            </div>
            {/* LO QUE DEBERIA HACER AHORA ES MOSTRAR LA INFORMACIÓN DE ESTE COMPONENTE(foto perfil, nombre, nro de playlists, nro de seguidores, nro de siguiendo y link del perfil de spotify) Y DESPUES SEGUIR CON EL COMPONENTE DE MostListenedEntity  */}
            {/* {console.log(user)} */}
        </div>
    )
};