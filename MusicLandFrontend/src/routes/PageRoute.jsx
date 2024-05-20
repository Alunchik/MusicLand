
import { Route, Routes, redirect } from 'react-router-dom';

import React  from 'react';

import Songs from '../pages/Songs';
import Registration from '../pages/Registration';
import Login from '../pages/Login';
import AddSong from '../pages/AddSong';
import UserDetails from '../pages/UserDetails';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { useCookies } from 'react-cookie'
import Admin from '../pages/Admin';


const PageRoute = () => {
    function hasCookie(name) {
        return document.cookie.split(';').some(c => c.trim().startsWith(name + '='));
      }
    return (
        <div>
<Routes>
    <Route path = "/" element={hasCookie('token') ? <Songs/> : <Navigate to="/login"/>}></Route>
    <Route path = "/registration" element={hasCookie('token') ? <Navigate to="/"/> : <Registration/>} ></Route>
    <Route path = "/addSong" element={hasCookie('token') ? <AddSong/> : <Navigate to="/login"/>} ></Route>
    <Route path = "/me" element={hasCookie('token') ? <UserDetails/> : <Navigate to="/login"/>} ></Route>
    <Route path = "/admin" element={hasCookie('isAdmin') ? <Admin/> : <Navigate to="/"/>} ></Route>
    <Route path = "/login" element={<Login/>} ></Route>
</Routes>
        </div>
    );
}


export default PageRoute;

