import { useState } from "react";
import { useEffect } from "react";
import PlayButton from "./PlayButton"
import axios from "axios";

const SongElement = (props) => {

    return (
        <div class="songElement">
            <div className="artistName">
                {PlayButton({id: props.AudioID})}
            {
                props.ArtistName
            }
            </div>
            <div className="title">
            {
                 props.title
            }
            </div>
            <div>
            {props.AudioID}
            </div>
        </div>
    )    
}

export default SongElement
