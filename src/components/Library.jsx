import React, { useState } from "react";
import { useEffect } from "react";
import LibraryEntityCollection from "./LibraryEntityCollection";
import LibraryEntity from "./LibraryEntity";

export default function Library() {
    const [userPlaylists, setUserPlaylists] = useState([]);
    const [userSavedAlbums, setUserSavedAlbums] = useState([]);
    const [userSavedSongs, setUserSavedSongs] = useState([]);

    useEffect(() => {
        const token = window.localStorage.getItem("token");

        if (token) {
            let options = {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const getUserPlaylists = async () => {
                const response = await fetch('https://api.spotify.com/v1/me/playlists', options);
                const data = await response.json();
                // console.log(data);
                setUserPlaylists(data);
            };

            const getUserSavedAlbums = async () => {
                const response = await fetch('https://api.spotify.com/v1/me/albums', options);
                const data = await response.json();
                // console.log(data);
                setUserSavedAlbums(data);
            };

            const getUserSavedSongs = async () => {
                const response = await fetch('https://api.spotify.com/v1/me/tracks', options);
                const data = await response.json();
                // console.log(data);
                setUserSavedSongs(data);
            };

            getUserPlaylists();
            getUserSavedAlbums();
            getUserSavedSongs();
        }
    }, []);

    return (
        <div className="bg-red-300 mt-6">
            <p className="mx-auto text-xl">Library</p>
            <LibraryEntityCollection entityType={'Playlists'} entities={userPlaylists} />
            <LibraryEntityCollection entityType={'Albums'} entities={userSavedAlbums} />
            <LibraryEntityCollection entityType={'Songs'} entities={userSavedSongs} />
        </div>
    )
};