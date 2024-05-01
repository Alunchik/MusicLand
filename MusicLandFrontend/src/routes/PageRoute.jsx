
import { Route, Routes } from 'react-router-dom';

import React  from 'react';

import Main from '../pages/Main';
import Songs from '../pages/Songs';


const PageRoute = () => {
function route(elem) {
        return true ? elem : <div/>
}

    return (
        <div>
<Routes>
    <Route path = "/" element={route(<Main/>)}></Route>
    <Route path = "/songs" element={route(<Songs/>)}></Route>
</Routes>
        </div>
    );
}


export default PageRoute;

