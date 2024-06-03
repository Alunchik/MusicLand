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
    const dispatch = useDispatch()
    // const songId = useSelector(state => state.comments.songId)
    // const handleOpenComments = () => {
    //     dispatch(fetchComments(props.id));
    // }
    return (
<div>
        <div class="songElement">
            <div className="songLine">
                {PlayButton({id: props.songData.AudioID, toggleSongState: props.toggleSongState, playing: props.playing})}
            <div className="title">
            {
                (props.songData.ArtistID ? props.songData.ArtistID  : "unnamed") + " - " + props.title
            }
            </div>
            </div>
            {hasCookie("isAdmin") ? DeleteButton({AudioId: props.songData.AudioID, id: props.id}) : <></>}
            </div>
            <div>
                {/* {songId == props.id ? <></> : CommentPanel({songId: props.id})} */}
            </div>
            {/* <button onClick={handleOpenComments()}></button> */}
            </div>
    )    
}

export default SongElement
