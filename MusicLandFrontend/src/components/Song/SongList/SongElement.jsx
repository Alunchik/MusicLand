import { useState } from "react";
import { useEffect } from "react";
import PlayButton from "./PlayButton"
import { useDispatch } from "react-redux";
import axios from "axios";
import { useSelector } from "react-redux";
import { fetchComments } from "../../../redux/slices/commentsSlice";
import DeleteButton from "./DeleteButton";
import '../../../style/Songs/songElement.css'
import CommentPanel from "../../Comment/CommentPanel";
import { setPlaying } from "../../../redux/slices/songsSlice";


const SongElement = (props) => {
    function hasCookie(name) {
        return document.cookie.split(';').some(c => c.trim().startsWith(name + '='));
      }

    //   const [currTime, setCurrTime] = useState({
    //     min: "",
    //     sec: "",
    //   }); // текущее положение звука в минутах и секундах
    
    //   useEffect(() => {
    //     const sec = duration / 1000;
    //     const min = Math.floor(sec / 60);
    //     const secRemain = Math.floor(sec % 60);
    //     const time = {
    //       min: min,
    //       sec: secRemain
    //     }});

    //     useEffect(() => {
    //         const interval = setInterval(() => {
    //           if (props.playing) {
    //             setSeconds(sound.seek([])); // устанавливаем состояние с текущим значением в секундах
    //             const min = Math.floor(sound.seek([]) / 60);
    //             const sec = Math.floor(sound.seek([]) % 60);
    //             setCurrTime({
    //               min,
    //               sec,
    //             });
    //           }
    //         }, 1000);
    //         return () => clearInterval(interval);
    //       }, [sound]);

    //   const [seconds, setSeconds] = useState(); // текущая позиция звука в секундах

    return (
<div>
        <div class="songElement">
            <div className="songLine">
                {PlayButton({id: props.songData.AudioID, toggleSongState: props.toggleSongState, playing: props.playing})}
            <div className="title">
            {
                (props.songData.ArtistID ? props.songData.ArtistID  : "unnamed") + " - " + props.songData.title
            }
                 {props.TimeScale(props.songData.AudioID)}

            </div>
            </div>
            {hasCookie("isAdmin") ? DeleteButton({AudioId: props.songData.AudioID, id: props.id}) : <></>}
            </div>
            <div>
            </div>
            </div>
    )    
}

export default SongElement
