import SongList from "../components/Song/SongList/SongList"
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchSongs, selectAllSongs } from "../components/redux/slices/songsSlice"
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
            <div className='SongPage'>
                {SongList(songs)}
            </div>
        </main>
    );
}

export default Songs;