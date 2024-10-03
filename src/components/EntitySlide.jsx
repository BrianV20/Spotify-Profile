import React from "react";

export default function EntitySlide({ artistName, artistImg, albumName, albumImg }) {
    const handleName = (Ename) => {
        if (Ename.length > 20) {
            return Ename.substring(0, 12) + '...';
        }
        return Ename;
    };

    return (
        <div className="border-2 border-black h-[100%]  bg-cover bg-center flex flex-col justify-end" style={{ backgroundImage: `url(${artistImg || albumImg})` }}>
            <p className="text-white bg-black bg-opacity-50 p-1">{handleName(artistName || albumName)}</p>
            {/* <p>{props.plays} reproducciones</p> */}
        </div>
    )
};