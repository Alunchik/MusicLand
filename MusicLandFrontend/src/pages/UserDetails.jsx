import { useDebugValue } from "react";
import { useDispatch } from "react-redux";
import { deleteJwt } from "../components/redux/slices/jwtSlice";


const UserDetails = () => {
    const dispatch = useDispatch();
    const handleLogOut = () => {
        dispatch(deleteJwt());
    }
    return(
        <main>
            <div className='MainBlock'>
                <button onClick={ handleLogOut}>Log out</button>
            </div>
        </main>
    );
}

export default UserDetails;