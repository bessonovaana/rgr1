import CodeForm from "./CodeForm.jsx"
import RegistrationForm from "./RegistrationForm.jsx"
import HeaderAuth from "../../HeaderAuth/HeaderAuthJsx/HeaderAuth.jsx"

export default function Form(props) {
  if (props.Type === "Registration") {
    return (
      <div>
        <HeaderAuth> Type = props.Type </HeaderAuth>
        <RegistrationForm />
      </div>
    );
  } else if (props.Type === "Code") {
    return (
      <div>
        <CodeForm />
      </div>
    );
  }

  return null;
}  