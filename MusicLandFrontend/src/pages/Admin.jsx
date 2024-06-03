import { useDebugValue } from "react";
import { useDispatch } from "react-redux";
import { logOut } from "../redux/slices/jwtSlice";
import { useSelector } from "react-redux";
import { useCookies } from "react-cookie";
import { useEffect } from "react";
import { selectAllSongs, fetchSongsByUser} from "../redux/slices/songsSlice";
import SongList from "../components/Song/SongList/SongList";
const Admin = () => {
    const dispatch = useDispatch();
    const name = useSelector(state => state.jwt.name);
    const login = useSelector(state => state.jwt.login);
    return(
        <main>
            Future admin panel
        </main>
    );
}

export default Admin;