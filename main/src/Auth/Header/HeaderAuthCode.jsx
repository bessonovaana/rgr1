import "../Header/Css/HeaderAuth.css";
import UndeLline from "../../images/UndeLline.png";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function HeaderAuthCode() {

  return (
    <div className="Header">
        <Link to="/" className="Text1 BtnWithoutLine Link" >
            Регистрация
        </Link>
        <div className="img enter">
            <Link className="Text1 Link" to="/Code">
            Авторизация
            </Link>
            <motion.img
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            
            src={UndeLline}
            alt="UndeLline"
           
            />
        </div>
    </div>
  );
}