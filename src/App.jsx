import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from './Contexts';
import UserInfoContainer from './components/UserInfoContainer';
import MostListenedEntity from './components/MostListenedEntity';
import Login from './components/Login';
import Library from './components/Library';
import FollowedArtists from './components/FollowedArtists';

function App() {
    // const CLIENT_ID = "057aa5d2c1734e53be06bd6ee1d00643";
    // const REDIRECT_URI = "http://localhost:5173/";
    // const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
    // const RESPONSE_TYPE = "token";

    const [token, setToken] = useState("");
    const [user, setUser] = useState({});
    // const [searchKey, setSearchKey] = useState("");

    useEffect(() => {
        const hash = window.location.hash;
        let token = window.localStorage.getItem("token");

        if (!token && hash) {
            token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];

            window.location.hash = "";
            window.localStorage.setItem("token", token);
        }

        setToken(token);
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
                setUser(data);
            } catch (error) {
                console.error("Error fetching user data:", error); // Debugging log
            }
        };

        if (token) {
            getUserImage();
        }
    }, [token]); // Add token as a dependency to ensure the effect runs when token changes

    const logout = () => {
        setToken("");
        window.localStorage.removeItem("token");
    };

    const updateUser = (userData) => {
        setUser(userData);
    };

    return (
        <div className='bg-[#242424]'>
            <UserContext.Provider value={user}>
                <div>
                    {!token ?
                        <Login updateUser={updateUser} />
                        : <button className='p-2 mb-2 border-2 border-black text-xl mt-3 rounded-lg bg-[#27c561] font-inter' onClick={logout}>Logout</button>}

                    {token &&
                        <div>
                            {/* {user.images && user.images.length > 0 && <img src={user.images[0].url} alt="user profile pic" />} */}
                            <UserInfoContainer />
                            <MostListenedEntity />
                            <Library />
                            <FollowedArtists />
                        </div>
                        // : <h2>Please login</h2>
                    }
                </div>
            </UserContext.Provider>
        </div>
    );
}

export default App;