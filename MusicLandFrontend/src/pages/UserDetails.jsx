import { useDebugValue } from "react";
import { useDispatch } from "react-redux";
import { logOut } from "../redux/slices/jwtSlice";
import { useSelector } from "react-redux";
import { useCookies } from "react-cookie";
import { useEffect } from "react";
import { selectAllSongs, fetchSongsByUser} from "../redux/slices/songsSlice";
import SongList from "../components/Song/SongList/SongList";
const UserDetails = () => {
    const dispatch = useDispatch();
    const name = useSelector(state => state.jwt.name);
        function deleteCookie(name) {
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;";
        document.cookie = name + '=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }
    const login = useSelector(state => state.jwt.login);
    const handleLogOut = () => {
        dispatch(logOut());
        deleteCookie("token");
        document.location.reload();
    }
    const songs = useSelector(selectAllSongs)
    const mySongStatus = useSelector(state => state.songs.mySongsStatus)
  
    useEffect(() => {
        if (mySongStatus === 'idle') {
          dispatch(fetchSongsByUser(login));
        }
      }, [mySongStatus, dispatch])

    return(
        <main>
            <div className='MainBlock'>
                <div>{"Name: " + name}</div>
                <div>{"Login: " + login}</div>
                <button onClick={ handleLogOut}>Log out</button>
            </div>
            <div>
                {SongList(songs)}
            </div>
        </main>
    );
}

export default UserDetails;