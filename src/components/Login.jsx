import React, { useEffect } from 'react';

function Login({ updateUser }) {
    const CLIENT_ID = "057aa5d2c1734e53be06bd6ee1d00643";
    const REDIRECT_URI = "http://localhost:5173/";
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
    const RESPONSE_TYPE = "token";
    const SCOPES = "user-read-email user-library-read user-follow-read user-top-read"; // Add necessary scopes

    const handleLogin = () => {
        window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${encodeURIComponent(SCOPES)}`;
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
            let options = {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const getUserImage = async () => {
                try {
                    const response = await fetch('https://api.spotify.com/v1/me', options);
                    const data = await response.json();
                    console.log("User data fetched from Spotify:", data); // Debugging log
                    updateUser(data);
                } catch (error) {
                    console.error("Error fetching user data:", error); // Debugging log
                }
            };

            getUserImage();
        }
    }, [updateUser]);

    return (
        <button className='p-2 border-2 border-black rounded-lg bg-blue-300' onClick={handleLogin}>
            Login to Spotify
        </button>
    );
}

export default Login;