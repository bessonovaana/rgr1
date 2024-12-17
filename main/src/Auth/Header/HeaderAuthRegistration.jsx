import "../Header/Css/HeaderAuth.css"
import UndeLline from "../../images/UndeLline.png"
import { Link } from 'react-router-dom'
import { motion } from "framer-motion"
import { useState } from "react" // Импортируем useState




export default function HeaderAuthRegistration(){
    return(
        <div className={'Header'}>
            <div className='img'>
                <Link className='Text1 Link' to="/">Регистрация</Link>
                <motion.img src={UndeLline} alt="UndeLline"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                />
                
            </div>
            
            <Link className='Text1 BtnWithoutLine Link' to="/Code">Авторизация</Link>
        </div>
        
    )
} 
