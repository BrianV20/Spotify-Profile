import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../Contexts";

export default function UserInfoContainer() {
    const user = useContext(UserContext);
    const [followingArtists, setFollowingArtists] = useState({});
    // La api devuelve las cosas con un sistema de paginado, por lo que para acceder a todos los artistas que sigue el usuario tengo que hacer 2, 3 o más fetch para tenerlos todos y guardarlos en algún estado o lo que sea. Pero en este caso solo necesito el número de artistas que sigue el usuario para mostrarlo, asi que solo hago un solo fetch (que en el caso de mi usuario me trae los primeros 20 de los 39 artistas que sigo) y ade ahí accedo a la propiedad total (que me trae el total definitivo de artistas que sigue el usuario) y muestro esa propiedad.
    const [followingPlaylists, setFollowingPlaylists] = useState({});
    // Con followingPlaylists pasa lo mismo, yo solo necesito mostrar el numero de playlists creadas por el usuario, y la api me trae directamente las mismas, asi que solo hago un fetch básico para acceder al nro de playlists creadas por el usuario.

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

            // let isNextNull = false;
            let fetchFollowingArtistsRoute = 'https://api.spotify.com/v1/me/following?type=artist';

            const getFollowing = async () => {
                try {
                    const response = await fetch(fetchFollowingArtistsRoute, options);
                    if (response.status === 403) {
                        console.error("ERROR 403: FORBIDDEN. CHECK IF THE TOKEN HAS NECESSARY SCOPES.");
                    }
                    const data = await response.json();
                    setFollowingArtists(data);
                    // console.log(data);
                } catch (error) {
                    console.error("ERROR: ", error);
                }
                // while (!isNextNull) {
                //     try {
                //         const response = await fetch(fetchFollowingArtistsRoute, options);
                //         if (response.status === 403) {
                //             console.error("Error 403: Forbidden. Check if the token has the necessary scopes.");
                //         }
                //         const data = await response.json();
                //         // console.log(data);
                //         setFollowingArtists(prevArtists => [...prevArtists, ...data.artists.items]);
                //         // console.log("el next: " + data.artists.next);
                //         if (data.artists.next == null) {
                //             isNextNull = true;
                //         }
                //         else {
                //             fetchFollowingArtistsRoute = data.artists.next;
                //         }
                //     } catch (error) {
                //         console.error("Error fetching following artists:", error);
                //     }
                // }
            };
            // console.log("Todos los artistas: \n");
            // console.log(followingArtists);

            let fetchFollowingPlaylistsRoute = 'https://api.spotify.com/v1/me/playlists';
            let isNextNull = false;
            // let contador = 0;

            const getFollowingPlaylists = async () => {
                try {
                    const response = await fetch(fetchFollowingPlaylistsRoute, options);
                    const data = await response.json();
                    setFollowingPlaylists(data);
                } catch(error) {
                    console.error("ERROR: ", error);
                }
                // while(isNextNull == false) {
                //     try {
                //         const response = await fetch(fetchFollowingPlaylistsRoute, options);
                //         const data = await response.json();
                //         console.log(data);
                //         setFollowingPlaylists(prevState => ({
                //             ...prevState,
                //             items: [...(prevState?.items || []), ...data.items]
                //         }));
                //         contador++;
                //         console.log("Vuelta ", contador);
                //         if(data.next == null){
                //             isNextNull = true;
                //         }
                //         else {
                //             fetchFollowingPlaylistsRoute = data.next;
                //         }
                //     } catch (error) {
                //         console.error("ERROR: ", error);
                //     }
                // }
            };

            getFollowing();
            getFollowingPlaylists();
            // console.log(followingPlaylists);
        }
    }, []);

    // useEffect(() => {
    //     console.log("Updated followingPlaylists:", followingPlaylists);
    // }, [followingPlaylists]);

    return (
        <div className="bg-red-200 border-2 border-black flex">
            <div className="border-2 border-blue-400 p-2">
                {user.images != undefined && <img src={user.images[0].url} alt="user profile pic" />}
            </div>
            <div className="border-2 border-green-500 flex-col">
                <div>
                    {user.display_name != undefined && <p className="text-2xl">{user.display_name}</p>}
                </div>
                <div>
                    {user.followers != undefined && <p>Followers: {user.followers.total}</p>}
                    {followingArtists?.artists?.total != null &&
                        <div>
                            <p>Following: {followingArtists.artists.total}</p>
                        </div>
                    }
                    {followingPlaylists?.total != null && 
                    <div>
                        <p>Public playlists: {followingPlaylists.total}</p>
                    </div>
                    }
                </div>
            </div>
        </div>
    );
}