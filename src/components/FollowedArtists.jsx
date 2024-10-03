import React from "react";
import { useEffect, useState } from "react";

export default function FollowedArtists() {
    const [followedArtists, setFollowedArtists] = useState([]);

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

            let isNextNull = false; //bandera
            let fetchFollowedArtistsRoute = 'https://api.spotify.com/v1/me/following?type=artist'; //fetch route
            let contador = 1;
            let temp = [];

            const getFollowedArtists = async () => {
                while(!isNextNull) {
                    try {
                        const response = await fetch(fetchFollowedArtistsRoute, options);
                        const data = await response.json();
                        console.log("\n\nVUELTA: ", contador, "\n\n");
                        console.log(data);
                        temp.push(data.artists.items);
                        contador++;
                        if(data.artists.next != null){
                            fetchFollowedArtistsRoute = data.artists.next;
                        }
                        else {
                            isNextNull = true;
                        }
                    } catch(error) {
                        console.error("ERROR: ", error);
                    }
                }
                // console.log(temp.flat());
                setFollowedArtists(temp.flat());
            };

            getFollowedArtists();
        }
    }, []);

    const ArtistCircle = ({ artName, artImg }) => {
        return (
            <div className="my-4 ml-2 flex ">
                <img src={artImg} className="w-[35%] h-[6rem] rounded-full border-2 border-gray-600" alt="artist image" />
                <p className="self-center pl-2 text-start">{artName}</p>
            </div>
        )
    };

    return (
        <div className="bg-purple-300 mt-5">
            <p className="text-xl p-1">Following</p>
            <div className="flex">
                {followedArtists.length > 0 && <div>
                    {followedArtists.map((art, i) => {
                        return <div key={i}>
                            <ArtistCircle artName={art.name} artImg={art.images[1].url} />
                        </div>
                    })}    
                </div>}
            </div>
        </div>
    )
};