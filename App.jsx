// imports
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import { ChakraProvider, Image } from "@chakra-ui/react";
import { useEffect, useState } from 'react';

// styles
import "./App.css";

// pages
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Project from "./pages/project/Project";
import Create from "./pages/create/Create";
import Profile from "./pages/profile/Profile";
import Projects from "./pages/projects/Projects";
import Settings from "./pages/settings/Settings";
import Edit from "./pages/edit/Edit";
import Community from "./pages/community/Community";
import Sources from "./pages/sources/Sources";

// components
import Navbar from "./components/Navbar";
import ScrollupBtn from "./components/ScrollupBtn";

// images
import Cytryna from './assets/img/cytryna.png'

// import footer

function App() {
  const { user, authIsReady } = useAuthContext();
  const [isSour, setIsSour] = useState(false);

  const handleMouseUp = () => {
    if(window.getSelection().toString() === 'Sour') {
      setIsSour(true);
    }
  }

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);

    return () => { document.removeEventListener('mouseup', handleMouseUp) };
  })

  return (
    <div className="App">
      {authIsReady && (
        <ChakraProvider>
          <BrowserRouter>
            {isSour && 
            <div className='susimg'>
              <Image 
                src={Cytryna}
                onClick={() => { setIsSour(false) }}
              />
            </div>}
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/login"
                element={
                  !user ? <Login /> : <Navigate replace to="/projects" />
                }
              />
              <Route
                path="/signup"
                element={
                  !user ? <Signup /> : <Navigate replace to="/projects" />
                }
              />
              <Route
                path="/project/:id"
                element={user ? <Project /> : <Navigate replace to="/login" />}
              />
              <Route
                path="/edit/:id"
                element={user ? <Edit /> : <Navigate replace to="/login" />}
              />
              <Route
                path="/community"
                element={
                  user ? <Community /> : <Navigate replace to="/login" />
                }
              />
              <Route
                path="/profile/:id"
                element={user ? <Profile /> : <Navigate replace to="/login" />}
              />
              <Route
                path="/settings/:id"
                element={user ? <Settings /> : <Navigate replace to="/login" />}
              />
              <Route
                path="/projects"
                element={user ? <Projects /> : <Navigate replace to="/login" />}
              />
              <Route
                path="/create"
                element={user ? <Create /> : <Navigate replace to="/login" />}
              />
              <Route
                path="/sources"
                element={ <Sources /> }
              />
              <Route path="/*" element={<Navigate to="/" />} />
            </Routes>
            <ScrollupBtn distance={500} />
          </BrowserRouter>
        </ChakraProvider>
      )}
    </div>
  );
}

export default App;
