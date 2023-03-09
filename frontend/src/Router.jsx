import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";

import SearchResults from "./components/SearchResults.jsx";
import ClipsBrowser from "./components/ClipsBrowser.jsx";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/search"} element={<SearchResults/>}/>
        <Route path={"/"} element={<ClipsBrowser/>}/>

        <Route path={"/view"} element={<ClipsBrowser/>}/>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;