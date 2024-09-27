import React from 'react';
import { useEffect, useState } from 'react';

function Login({ updateUser }) {
    const CLIENT_ID = "057aa5d2c1734e53be06bd6ee1d00643";
    const REDIRECT_URI = "http://localhost:5173/";
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
    const RESPONSE_TYPE = "token";

    const handleLogin = () => {
        window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`;
    };

    useEffect(() => {
        const hash = window.location.hash;
        let token = window.localStorage.getItem("token");

        if (!token && hash) {
            token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];

            window.location.hash = "";
            window.localStorage.setItem("token", token);
        }

        if (token) {
            const getUserImage = async () => {
                let options = {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                try {
                    const response = await fetch('https://api.spotify.com/v1/me', options);
                    const data = await response.json();
                    // console.log("User data fetched from Spotify:", data); // Debugging log
                    updateUser(data);
                } catch (error) {
                    // console.error("Error fetching user data:", error); // Debugging log
                }
            };

            getUserImage();
        }
    }, []);

    return (
        <button className='p-2 border-2 border-black rounded-lg bg-blue-300' onClick={handleLogin}>
            Login to Spotify
        </button>
    );
}

export default Login;