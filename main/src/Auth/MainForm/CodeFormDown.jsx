import Btn from "../../images/Btn.png"
import "../MainForm/Css/FormCode.css"
import HeaderCode from "../Header/HeaderAuthCode.jsx"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form";
import React, { useState } from "react";
import axios from "axios";
import {useNavigate} from 'react-router-dom'

export default function CodeFormDown({handleAuthChange, handleNameChange}){
    const navigate = useNavigate();

    const toggleName = (name) => {
        handleNameChange(name); // Переключаем статус аутентификации
    };

    const toggleAuth = (auth) => {
        handleAuthChange(auth); // Переключаем статус аутентификации
    };
    const [isTouched, setIsTouched] = useState({ email: false});
    const [userNotFound, setUserNotFound] = useState(false);

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm({
        mode: 'onTouched',
    });

    const onSubmit = (data) => {
        reset();
        axios.post('http://localhost:8000/Login/', {
            username: data.Name,
            password: data.password,
        }, 
            {
            headers: {
                'Content-Type': 'application/json'
            }
            
        }).then(response => {
            debugger

            localStorage.setItem('accessToken', response.data.access);

            localStorage.setItem('refreshToken', response.data.refresh);

            toggleAuth(true);

            debugger

            toggleName(data.Name);

            localStorage.setItem('userName', `${data.Name}`)

            localStorage.setItem('isAuth', 'true');


            navigate(`/video/${data.Name}/`)
        })
        .catch(response => {
            console.log(response.data?.error);
            setUserNotFound(true);

    })
        
    };
    
    return(

        <div>
        
    
            <form onSubmit={handleSubmit(onSubmit)}>
                <HeaderCode></HeaderCode>
                <motion.div className = {'FormAuth'}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.22 }}
                    >
                    <div className="Registration">
                        <span className='Text Authorization'>Данные для авторизации</span>
                    </div>
                    
                    <span className='Text UserData NameInput'>Имя</span>

                    <input
                        {...register("Name", {
                            required: "*Поле обязательно для заполнения",
                            pattern: {
                                value: /^[А-Яа-яЁёa-zA-Z-']{2,}$/,
                                message: "*Данные не удовлетворяют требованиям",
                            },
                        })}

                        placeholder="Имя"
                        onFocus={() => {
                            setIsTouched(prev => ({ ...prev, name: true }));
                            setUserNotFound(false);
                        }}
                        onBlur={() => setIsTouched(prev => ({ ...prev, name: false }))}
                    />
                    <div className="ErrorText">
                        {isTouched.name && errors?.Name && 
                        <motion.p
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2 }}>
                            {errors?.Name?.message || "Error!"}
                        </motion.p>}
                    </div>

                    <span className='Text UserData'>Пароль</span>

                    <input
                        {...register("password", {
                            required: "*Поле обязательно для заполнения",
                            minLength: {
                                value: 8,
                                message: "*Пароль слишком короткий",
                            }
                        })}
                        placeholder="Пароль"
                        onFocus={() => {
                            setIsTouched(prev => ({ ...prev, password: true }));
                            setUserNotFound(false);
                        }}
                        onBlur={() => setIsTouched(prev => ({ ...prev, password: false }))}
                    />
                    <div className="ErrorText">
                        {isTouched.password && errors?.password && <motion.p
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2 }}>
                        {errors?.password?.message || "Error!"}</motion.p>}
                    </div>
                    
                        <button type='submit' className='button'>
                            <img src={Btn} alt="Send" />
                            <div className="ErrorText userExists">
    
    {userNotFound && (
    <motion.p
    
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }} 
    >
        Неверное имя или пароль
    </motion.p>
    )}

</div>
                        </button>

                </motion.div>

            </form>
        </div>
    )
}