import Home from "./pages/Home/Home"
import React from "react";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const routes = (
  <Router>
    <Routes>
      <Route path="/dashboard" exact element={<Home />} />
      <Route path="/login" exact element={<Login />} />
      <Route path="/signUp" exact element={<SignUp />} />
    </Routes>
  </Router>
)

function App() {


  return (
    <>
      <div>
        {routes}
      </div>
    </>
  )
}

export default App
