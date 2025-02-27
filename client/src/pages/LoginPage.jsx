import { useEffect, useState } from "react";
import "../styles/loginpage.scss";
import { useSelector, useDispatch } from "react-redux";
import { useLoginMutation } from "../features/auth/authApiSlice";
import { getUser, setCredentials } from "../features/auth/authSlice";
import { Button, PasswordInput, TextInput } from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import rome from "../assets/Rome.jpg";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();
  const userInfo = useSelector(getUser);

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const handlesubmit = async (e) => {
    e.preventDefault();
    const payload = {
      email: formData.email,
      password: formData.password,
    };

    try {
      const res = await login(payload).unwrap();
      dispatch(setCredentials(res));
      if (res) {
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="loginContainer">
      <div className="loginContainer__form">
        <h1 className="loginMessage">Welcome Back</h1>
        <form onSubmit={handlesubmit} className="formContiner">
          <TextInput
            label="Email"
            size="sm"
            placeholder="Enter your email"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="formContainer__email"
          />
          <PasswordInput
            label="Password"
            size="sm"
            placeholder="Enter your Password"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="formContainer__password"
          />
          <Button onClick={handlesubmit} className="formContainer__submit">
            {isLoading ? "Logging In" : "Login"}
          </Button>
        </form>

        <div className="loginContainer__options">
          <p className="optionsMessage">Dont have an account ?</p>
          <Link to="/signin">
            <Button className="optionsSignin">Signin</Button>
          </Link>
        </div>
      </div>

      <div className="loginContainer__image">
        <div className="imageContainer">
          <img src={rome} className="imageContainer__image" />
        </div>
      </div>
    </div>
  );
};

export default Login;
