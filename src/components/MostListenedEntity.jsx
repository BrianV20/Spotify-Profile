import React, { useEffect, useState, useCallback } from "react";
import EntitySlide from "./EntitySlide";

export default function MostListenedEntity() {
    const [topArtists, setTopArtists] = useState([]);
    const [topSongs, setTopSongs] = useState([]);
    const [topAlbums, setTopAlbums] = useState([]);
    const [selectedOptionAlbums, setSelectedOptionAlbums] = useState('Last Month');
    const [selectedOptionArtists, setSelectedOptionArtists] = useState('Last Month');
    const [fetchTopSongsEndpoint, setFetchTopSongsEndpoint] = useState('https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=short_term');
    const [fetchTopArtistsEndpoint, setFetchTopArtistsEndpoint] = useState('https://api.spotify.com/v1/me/top/artists?limit=10&time_range=short_term');
    const [isFetching, setIsFetching] = useState(false);
    const [loadingArtists, setLoadingArtists] = useState(false);

    const handleOptionChangeAlbums = useCallback((event) => {
        setSelectedOptionAlbums(event.target.value);
        let timeRange = 'short_term';
        if (event.target.value === "Last 6 months") {
            timeRange = 'medium_term';
        } else if (event.target.value === "Last year") {
            timeRange = 'long_term';
        }
        setFetchTopSongsEndpoint(`https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=${timeRange}`);
        setTopSongs([]); // Reset topSongs when the endpoint changes
    }, []);

    const handleOptionChangeArtists = useCallback((event) => {
        setSelectedOptionArtists(event.target.value);
        let timeRange = 'short_term';
        if (event.target.value === "Last 6 months") {
            timeRange = 'medium_term';
        } else if (event.target.value === "Last year") {
            timeRange = 'long_term';
        }
        setFetchTopArtistsEndpoint(`https://api.spotify.com/v1/me/top/artists?limit=10&time_range=${timeRange}`);
        setLoadingArtists(true); // Set loading state for artists
    }, []);

    useEffect(() => {
        const token = window.localStorage.getItem("token");

        if (token && !isFetching) {
            setIsFetching(true);
            let options = {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const getTopArtists = async () => {
                try {
                    const response = await fetch(fetchTopArtistsEndpoint, options);
                    const data = await response.json();
                    setTopArtists(data.items);
                    setLoadingArtists(false); // Reset loading state for artists
                } catch (error) {
                    console.error("ERROR: ", error);
                    setLoadingArtists(false); // Reset loading state for artists in case of error
                }
            };

            const getTopSongs = async () => {
                let accumulatedSongs = [];
                let nextEndpoint = fetchTopSongsEndpoint;
                let isNextNull = false;
                while (!isNextNull) {
                    try {
                        const response = await fetch(nextEndpoint, options);
                        const data = await response.json();

                        accumulatedSongs = [...accumulatedSongs, ...data.items];
                        if (accumulatedSongs.length >= 100 || !data.next) {
                            isNextNull = true;
                            accumulatedSongs = accumulatedSongs.slice(0, 100); // Ensure only 100 songs are kept
                        } else {
                            nextEndpoint = data.next;
                        }
                    } catch (error) {
                        console.error("ERROR: ", error);
                        isNextNull = true;
                    }
                }
                setTopSongs(accumulatedSongs);
                return accumulatedSongs;
            };

            const getTopAlbumsBasedOnTopSongs = async (songs) => {
                let actualSongs = await songs;
                let albumsTitles = actualSongs.map(song => song.album);

                const uniqueAlbums = albumsTitles.reduce((acc, album) => {
                    if (!acc.some(item => item.id === album.id)) {
                        Object.defineProperty(album, 'amountOfSongs', { value: 0, writable: true });
                        acc.push(album);
                    }
                    return acc;
                }, []);

                for (let i = 0; i < uniqueAlbums.length; i++) {
                    for (let c = 0; c < actualSongs.length; c++) {
                        if (actualSongs[c].album.id === uniqueAlbums[i].id) {
                            uniqueAlbums[i].amountOfSongs += 1;
                        }
                    }
                }

                let orderedAlbums = uniqueAlbums.sort((a, b) => b.amountOfSongs - a.amountOfSongs);
                return orderedAlbums;
            };

            const fetchAndProcessData = async () => {
                await getTopArtists();
                let songsToGetTheTopAlbums = await getTopSongs();
                setTopAlbums(await getTopAlbumsBasedOnTopSongs(songsToGetTheTopAlbums));
                setIsFetching(false);
            };

            fetchAndProcessData();
        }
    }, [fetchTopSongsEndpoint, fetchTopArtistsEndpoint, isFetching]);

    return (
        <>
            <div className="border-2 border-black bg-violet-300 py-2 px-1">
                <div className="flex justify-between">
                    <p>Main artists this month</p>
                    <select value={selectedOptionArtists} onChange={handleOptionChangeArtists} className="w-[45%] bg-white border border-gray-400 hover:border-gray-500 mx-auto py-2 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                        <option value="Last month">Last month</option>
                        <option value="Last 6 months">Last 6 months</option>
                        <option value="Last year">Last year</option>
                    </select>
                </div>
                <div>
                    {(topArtists.length > 0 || loadingArtists) &&
                        <div className="flex min-h-[16rem] mt-4">
                            <div className="w-[50%] min-h-full">
                                <EntitySlide artistName={topArtists[0]?.name} artistImg={topArtists[0]?.images[1]?.url} />
                            </div>
                            <div className="w-[50%] flex flex-wrap border-2 border-gray-500">
                                {topArtists.map((artist, i) => {
                                    if (i > 0 && i < 5) {
                                        return (
                                            <div className="w-[50%] h-[50%]" key={i}>
                                                <EntitySlide artistName={artist.name} artistImg={artist.images[1].url} />
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                            </div>
                        </div>
                    }
                </div>
            </div>
            <div className="border-2 border-black bg-violet-300 py-2 px-1 mt-5">
                <div className="flex justify-between">
                    <p>Main albums this month</p>
                    <select value={selectedOptionAlbums} onChange={handleOptionChangeAlbums} className="w-[45%] bg-white border border-gray-400 hover:border-gray-500 mx-auto py-2 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                        <option value="Last month">Last month</option>
                        <option value="Last 6 months">Last 6 months</option>
                        <option value="Last year">Last year</option>
                    </select>
                </div>
                <div>
                    {topAlbums.length > 0 &&
                        <div className="flex min-h-[16rem] bg-pink-300 mt-4">
                            <div className="w-[50%] min-h-full">
                                <EntitySlide albumName={topAlbums[0].name} albumImg={topAlbums[0].images[1].url} />
                            </div>
                            <div className="w-[50%] flex flex-wrap border-2 border-gray-500">
                                {topAlbums.map((album, i) => {
                                    if (i > 0 && i < 5) {
                                        return (
                                            <div className="w-[50%] h-[50%]" key={i}>
                                                <EntitySlide albumName={album.name} albumImg={album.images[1].url} />
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                            </div>
                        </div>
                    }
                </div>
            </div>
        </>
    );
}