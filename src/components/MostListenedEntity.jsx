import React from "react";
import { useEffect, useState } from "react";
import EntitySlide from "./EntitySlide";

export default function MostListenedEntity() {
    const [topArtists, setTopArtists] = useState([]);
    const [topSongs, setTopSongs] = useState([]);

    useEffect(() => {
        const token = window.localStorage.getItem("token");

        if (token) {
            let options = {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const getTopArtists = async () => {
                try {
                    const response = await fetch(`https://api.spotify.com/v1/me/top/artists?limit=20&time_range=short_term`, options);
                    const data = await response.json();
                    // console.log(data.items);
                    setTopArtists(data.items);
                } catch (error) {
                    console.error("ERROR: ", error);
                }
            };

            let fetchTopSongsEndpoint = 'https://api.spotify.com/v1/me/top/tracks?limit=50';
            let timeRange = 'short_term';
            let isNextNull = false;
            // let contador = 0;
            const getTopAlbums = async () => {
                let accumulatedSongs = [];
                while(!isNextNull) {
                    try {
                        const response = await fetch(`${fetchTopSongsEndpoint}&${timeRange}`, options);
                        const data = await response.json();

                        accumulatedSongs = [...accumulatedSongs, ...data.items];
                        if (accumulatedSongs.length >= 100) {
                            isNextNull = true;
                            accumulatedSongs = accumulatedSongs.slice(0, 100); // Ensure only 100 songs are kept
                        }
                        // console.log(topSongs);
                        // console.log(data);
                        // topSongs = [...topSongs, ...data.items];
                        // setTopSongs(prevState => prevState += data.items);
                        setTopSongs(prevTopSongs => {
                            const newTopSongs = [...prevTopSongs, ...data.items];
                            if (newTopSongs.length >= 100) {
                                isNextNull = true;
                                return newTopSongs.slice(0, 100); // Ensure only 100 songs are kept
                            }
                            return newTopSongs;
                        });
                        // setTopSongs(prevTopSongs => {
                        //     const newTopSongs = [...prevTopSongs, ...data.items];
                        //     if (newTopSongs.length >= 100) {
                        //         isNextNull = true;
                        //         return newTopSongs.slice(0, 100);
                        //     }
                        //     return newTopSongs;
                        // });
                        // console.log(topSongs.length);
                        // console.log("TOP SONGS LENGTH: ", topSongs.length);
                        // console.log("VUELTA ", contador, ". NEXT: ", data.next);

                        console.log(topSongs.length);
                        if(topSongs.length >= 100) {
                            isNextNull = true;
                        }
                        else{
                            if(data.next != null) {
                                fetchTopSongsEndpoint = data.next;
                            } else {
                                isNextNull = true;
                            }
                        }
                        // contador ++;
                    } catch(error) {
                        console.error("ERROR: ", error);
                    }
                }
                setTopSongs(accumulatedSongs);
            };

            getTopArtists();
            getTopAlbums();
        }
    }, []);

    useEffect(() => {
        console.log("El valor actual de top songs: ");
        console.log(topSongs);
    }, [topSongs]);

    return (
        <div className="border-2 border-black bg-violet-300 py-2 px-1">
            <div className="flex justify-between">
                <p>Main artists this month</p>
                <p className="border-2 border-black p-1">Ultimo mes <i className="fa-solid fa-arrow-down"></i></p>
            </div>
            <div>
                {topArtists.length > 0 &&
                    <div className="flex min-h-[16rem]">
                        <div className="w-[50%] min-h-full">
                            <EntitySlide artistName={topArtists[0].name} artistImg={topArtists[0].images[1].url} />
                        </div>
                        <div className="w-[50%] flex flex-wrap border-2 border-gray-500">
                            {topArtists.map((artist, i) => {
                                // console.log("El artista: ", artist);
                                if (i > 0) {
                                    if (i < 5) {
                                        return <div className="w-[50%] h-[50%]" key={i}>
                                            <EntitySlide artistName={artist.name} artistImg={artist.images[1].url} />
                                        </div>
                                    }
                                }
                            })}
                        </div>
                    </div>}
            </div>
        </div>
    )
};