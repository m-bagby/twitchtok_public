import React from "react";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";

import SearchResults from "./components/SearchResults.jsx";
import ClipsBrowser from "./components/ClipsBrowser.jsx";

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={"/search"} element={<SearchResults/>}/>
                <Route path={"/"} element={<ClipsBrowser/>}/>

                <Route path={"/view"} element={<ClipsBrowser/>}/>
                <Route path={"*"} element={<Navigate to={"/"} />} />
            </Routes>
        </BrowserRouter>
    );
};

export default Router;