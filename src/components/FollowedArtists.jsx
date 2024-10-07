import React from "react";
import { useEffect, useState } from "react";

export default function FollowedArtists() {
    const [followedArtists, setFollowedArtists] = useState([]);
    const [isFetching, setIsFetching] = useState(false);

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

            const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

            const getFollowedArtists = async () => {
                let retryCount = 0;
                const maxRetries = 5;
                while(!isNextNull) {
                    try {
                        const response = await fetch(fetchFollowedArtistsRoute, options);
                        if (response.status === 429) {
                            const retryAfter = response.headers.get('Retry-After');
                            const delayTime = retryAfter ? parseInt(retryAfter) * 1000 : 1000;
                            console.warn(`Rate limited. Retrying after ${delayTime} ms`);
                            await delay(delayTime);
                            retryCount++;
                            if (retryCount > maxRetries) {
                                console.error("Max retries reached. Exiting.");
                                isNextNull = true;
                            }
                            continue;
                        }
                        const data = await response.json();
                        console.log("\n\nVUELTA: ", contador, "\n\n");
                        console.log(data);
                        if(data.artists && data.artists.items){
                            temp.push(data.artists.items);
                            contador++;
                            if(data.artists.next){
                                fetchFollowedArtistsRoute = data.artists.next;
                            }
                            else {
                                isNextNull = true;
                            }
                        }
                        else{
                            console.error("Unexpected response format: ", data);
                            isNextNull = true;
                        }
                    } catch(error) {
                        console.error("ERROR: ", error);
                        isNextNull = true;
                    }
                }
                // console.log(temp.flat());
                setFollowedArtists(temp.flat());
                setIsFetching(false);
            };

            getFollowedArtists();
        }
    }, [isFetching]);

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