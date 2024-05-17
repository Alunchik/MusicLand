
import { Route, Routes } from 'react-router-dom';

import React  from 'react';

import Main from '../pages/Main';
import Songs from '../pages/Songs';
import Registration from '../pages/Registration';
import Login from '../pages/Login';
import AddSong from '../pages/AddSong';



const PageRoute = () => {
function route(elem) {
        return true ? elem : <div/>
}

    return (
        <div>
<Routes>
    <Route path = "/" element={route(<Main/>)}></Route>
    <Route path = "/songs" element={route(<Songs/>)}></Route>
    <Route path = "/registration" element={route(<Registration/>)}></Route>
    <Route path = "/login" element={route(<Login/>)}></Route>
    <Route path = "/addSong" element={route(<AddSong/>)}></Route>
</Routes>
        </div>
    );
}


export default PageRoute;

