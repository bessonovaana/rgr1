import React, { useState, useEffect } from 'react';
import BackGround from "./BackGround/BackGroundJsx/BackGround.jsx";
import FormCode from "./Auth/MainForm/CodeFormDown.jsx";
import FormReg from "./Auth/MainForm/RegistrationForm.jsx";
import Header from "./Header/HeaderJsx/header.jsx";
import { BrowserRouter as Router, Route, Routes, Outlet, Navigate } from 'react-router-dom';
import Video from "./video/video.jsx";

function NotFound(){
    return(
        <div>
            <h1>NOT FOUND 404</h1>
        </div>
    )
}

function App() {
    const [userName, setUserName] = useState(localStorage.getItem('userName'))
    const [isAuth, setIsAuth] = useState(localStorage.getItem('isAuth') === 'true');

    useEffect(() => {
        const handleStorageChange = () => {
            setIsAuth(localStorage.getItem('isAuth') === 'true');
            setUserName(localStorage.getItem('userName'));
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const handleNameChange = (userName) => {
        setUserName(userName);
       
    };

    const handleAuthChange = (authStatus) => {
        setIsAuth(authStatus);
        localStorage.setItem('isAuth', authStatus.toString());
    };

    const PrivateRoute = () => {
        return isAuth ? <Outlet /> : <Navigate to="/" />;
    };

    const PublicRoute = () => {
        return isAuth ? <Navigate to= {`/video/${userName}`} /> : <Outlet />;
    };

    return (
        <div>
            <Router>
    <Header handleAuthChange={handleAuthChange} username={userName} />
    <Routes>
        {/* Маршруты для публичных страниц */}
        <Route element={<PublicRoute />}>
            <Route path="/" element={<FormReg />} />
            <Route path="/Code" element={<FormCode handleAuthChange={handleAuthChange} handleNameChange={handleNameChange} />} />
        </Route>

        {/* Маршруты для защищенных страниц */}
        <Route element={<PrivateRoute />}>
            <Route path={`/video/${userName}`} element={<Video user={userName} />} />
        </Route>

        {/* Обработка всех остальных маршрутов */}
        <Route path="*" element={<NotFound />} />
    </Routes>
    <BackGround />
</Router>
        </div>
    );
}

export default App;
