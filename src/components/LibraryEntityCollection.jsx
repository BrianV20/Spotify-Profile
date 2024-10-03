import React from "react";
import LibraryEntity from "./LibraryEntity";

export default function LibraryEntityCollection({ entityType, entities }) {

    return (
        <div className="bg-[#121212] p-2">
            <p className="text-lg text-slate-100">{entityType}</p>
            <div className="border-2 border-gray-400">
                {entities?.items?.map((ent, i) => {
                    return <div key={i}>
                        {entityType === 'Playlists' && <LibraryEntity entityName={ent.name} entityImg={ent.images[0].url} playlistSongs={ent.tracks.total} />}
                        {entityType === 'Albums' && <LibraryEntity entityName={ent.album.name} entityImg={ent.album.images[1].url} />}
                        {entityType === 'Songs' && <LibraryEntity entityName={ent.track.name} entityImg={ent.track.album.images[1].url} />}
                    </div>
                    
                })}
            </div>
        </div>
    )
};