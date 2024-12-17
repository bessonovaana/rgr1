import  "../Css/header.css"
import logo from "../../images/YadroLogo.png"
import UserIcon from "../../images/User.png"
import exit from "../../images/Exit.png"
import { useNavigate, Navigate } from "react-router-dom"
import { useState,useEffect } from "react"


function Header({handleAuthChange, username}) {
    const navigate = useNavigate()
    const [user, setUser] = useState(username)
    
    const toggleAuth = () => {
        debugger
        localStorage.setItem('isAuth', 'false');
        handleAuthChange(false);
        navigate('/'); // Переход на главную страницу после выхода
    };

    useEffect(() => {
        if(user === null)
            setUser('')
        else{
            setUser(username)
        }
    }, []);

   
    

    return (
        <header className="header">

            <div className="left">
                <a>
                    <img src={logo} alt="Yadro" />
                </a>
            </div>
            
            <div className="right">

            
                <img className="reg" onClick={toggleAuth}  src={exit} alt="Exit" />

                <img className="reg" src={UserIcon} alt="User" />
                <span className="username">{username}</span>
            
            </div>

        </header>
    );
}

export default Header;