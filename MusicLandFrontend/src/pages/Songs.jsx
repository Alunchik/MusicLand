import SongList from "../components/Song/SongList/SongList"
import React, { useEffect } from 'react'
import WebSocketElem from "../components/AudioPlayer"
import { useSelector, useDispatch } from 'react-redux'
import { fetchSongs, selectAllSongs, startListening, sendMessage } from "../components/redux/slices/songsSlice"
const Songs = () => {
const dispatch = useDispatch()
  const songs = useSelector(selectAllSongs)
  const songStatus = useSelector(state => state.songs.status)

  useEffect(() => {
    console.log(songStatus)
    if (songStatus === 'idle') {
      dispatch(fetchSongs());
      console.log(songs)
    }
  }, [songStatus, dispatch])

  return(
        <main>
          <WebSocketElem/>
            <div className='SongPage'>
                {SongList(songs)}
            </div>
        </main>
    );
}

export default Songs;