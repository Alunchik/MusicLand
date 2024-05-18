
import { Route, Routes } from 'react-router-dom';

import React  from 'react';

import Songs from '../pages/Songs';
import Registration from '../pages/Registration';
import Login from '../pages/Login';
import AddSong from '../pages/AddSong';
import UserDetails from '../pages/UserDetails';
import { useSelector } from 'react-redux';



const PageRoute = () => {

    const authStatus = useSelector(state => state.jwt.status);

    const isAuth = () => {
        console.log(authStatus)
        return  (authStatus === "auth")
    }

function protect(elem) { 
        return isAuth ? elem : <Login/>
}
function onlyUnauth(elem) {
    return !isAuth ? elem : <></>
}

    return (
        <div>
<Routes>
    <Route path = "/" element={protect(<Songs/>)}></Route>
    <Route path = "/registration" element={onlyUnauth(<Registration/>)}></Route>
    <Route path = "/addSong" element={protect(<AddSong/>)}></Route>
    <Route path = "/me" element={protect(<UserDetails/>)}></Route>
</Routes>
        </div>
    );
}


export default PageRoute;

