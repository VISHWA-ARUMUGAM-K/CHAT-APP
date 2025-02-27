import { useEffect, useState } from "react";
import "../styles/signuppage.scss";
import { useSelector, useDispatch } from "react-redux";
import { useSigninMutation } from "../features/auth/authApiSlice";
import { getUser, setCredentials } from "../features/auth/authSlice";
import { Button, PasswordInput, TextInput } from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import rome from "../assets/Rome.jpg";

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [signin, { isLoading }] = useSigninMutation();
  const userInfo = useSelector(getUser);

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const handlesubmit = async (e) => {
    e.preventDefault();
    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
    };
    try {
      const res = await signin(payload).unwrap();
      dispatch(setCredentials(res));
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="signinContainer">
      <div className="signinContainer__form">
        <h1 className="signinMessage">Welcome Back</h1>
        <form onSubmit={handlesubmit} className="formContainer">
          <TextInput
            label="fullName"
            size="sm"
            placeholder="Enter your FullName"
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            className="formContainer__fullName"
          />
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
            style={{ marginBottom: "10px" }}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="formContainer__password"
          />
          <Button onClick={handlesubmit} className="formContainer__submit">
            {isLoading ? "creating" : "Create Account"}
          </Button>
        </form>

        <div className="signinContainer__options">
          <p className="optionsMessage">Already have an account?</p>
          <Link to="/login">
            <Button className="optionsLogin">Login</Button>
          </Link>
        </div>
      </div>

      <div className="signinContainer__image">
        <div className="imageContainer">
          <img src={rome} className="imageContainer__image" />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
