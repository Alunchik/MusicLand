import { useState } from "react";
import { useEffect } from "react";
import PlayButton from "./PlayButton"
import axios from "axios";
import DeleteButton from "./DeleteButton";
import '../../../style/Songs/songElement.css'
const SongElement = (props) => {
    return (
        <div class="songElement">
            <div className="songLine">
                {PlayButton({id: props.AudioID})}
            <div className="title">
            {
                (props.ArtistID ? props.ArtistID  : "unnamed") + " - " + props.title
            }
            </div>
            </div>
            {DeleteButton({AudioID: props.AudioID, id: props.id})}
            </div>
    )    
}

export default SongElement
