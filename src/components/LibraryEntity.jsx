import React from "react";

export default function LibraryEntity({ entityImg, entityName, playlistSongs }) {

    return (
        <div className="flex my-3">
            <img src={entityImg} className="w-[25%] min-h-[4rem] rounded-lg" alt="playlist image" />
            <div className="">
                <p className="pt-1 pl-2 text-slate-100 text-start">{entityName}</p>
                {playlistSongs != null && <p className="text-start text-slate-400 text-sm pl-2">{playlistSongs} songs</p>}
            </div>
        </div>
    )
};