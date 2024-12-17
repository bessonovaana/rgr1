import React, { useState, useEffect } from "react";
import Btn from "../../images/Btn.png";
import HeadReg from "../Header/HeaderAuthRegistration.jsx";
import "../MainForm/Css/FormReg.css";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import axios from "axios";




export default function FormRegistration() {
    const [details, setDetails] = useState([]);
    const [isTouched, setIsTouched] = useState({ email: false, password: false, name: false });
    const [flag, setFlag] = useState(false);
    const [userExists, setUserExists] = useState(false);



    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm({ mode: 'onTouched' });

    useEffect(() => {
        axios.get('http://localhost:8000/user/')
            .then(response => {
                setDetails(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, [flag]); 


    const onSubmit = (data) => {
        reset();
        axios.post('http://localhost:8000/registration/', {
            username: data.Name,
            password: data.password,
            email : data.Email
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response) => {

            if (response.status != 201) return

            localStorage.setItem('accessToken', response.data.access);

            localStorage.setItem('refreshToken', response.data.refresh);
            


        })
        .catch((response) => {
            if (response.status === 400) {
                if (!userExists) {
                    setUserExists(true); // Устанавливаем в true, если пользователь существует
                }
                   
            } 
        })
    };
    
    
   

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            
            <HeadReg />
            <motion.div
                className='FormRegistration'
                initial={{ opacity: 0.5, scale: 0 }}
                animate={{ opacity: 1, scale: 0.99 }}
                transition={{ duration: 0.22 }}
            >
            
                <div className="Registration">
                    <span className='Text Authorization'>Данные для регистрации</span>
                </div>

                <span className='Text EmailInput'>Электронная почта</span>
                <input
                    {...register("Email", {
                        required: "*Поле обязательно для заполнения",
                        pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: "* Данные не удовлетворяют требованиям",
                        },
                    })}
                    placeholder="Email"
                    onFocus={() => {
                        setIsTouched(prev => ({ ...prev, email: true }));
                        setUserExists(false);
                      }}
                    onBlur={() => setIsTouched(prev => ({ ...prev, email: false }))}
                />
                <div className="ErrorText">
                    {isTouched.email && errors?.Email && <motion.p
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                    >{errors?.Email?.message || "Error!"}</motion.p>}
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
                        setUserExists(false);
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
                        setUserExists(false);
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
                        
                    </button>

                    <div className="ErrorText userExists">
    
                    {userExists && (
                    <motion.p
                       
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }} 
                    >
                        Такой пользователь уже существует
                    </motion.p>
                    )}

                    </div>
                
                <span className='PS'>* поле, обязательное для заполнения</span>
            </motion.div>

            {/* Вывод полученных данных */}
            <div onSubmit={handleSubmit(onSubmit)}>
                <h3>Полученные данные:</h3>
                {details.length > 0 ? (
                    <ul>
                        {details.map((detail, index) => (
                            <li key={index}>{JSON.stringify(detail)}</li>
                        ))}
                    </ul>
                ) : (
                    <p>Нет данных для отображения.</p>
                )}
            </div>
        </form>
    );
}
