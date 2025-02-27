import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.scss";
import { LogOut, MessageSquareDashed } from "lucide-react";
import { Button } from "@mantine/core";
import { useSelector } from "react-redux";
import { getUser } from "../features/auth/authSlice";
import { useLogoutMutation } from "../features/auth/authApiSlice";

const Navbar = () => {
  const user = useSelector(getUser);
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logout().unwrap();
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header className="navHeader">
      <div className="container">
        <div className="headerContainer">
          <Link to="/">
            <div className="headerLogo">
              <MessageSquareDashed size={32} />
            </div>
          </Link>
          {/* {!user && ( */}
          {/*   <Link to="/signin"> */}
          {/*     <Button */}
          {/*       leftSection={<User2 size={19} />} */}
          {/*       className="headerRight__signin" */}
          {/*     > */}
          {/*       Sign in */}
          {/*     </Button> */}
          {/*   </Link> */}
          {/* )} */}
          {user && (
            <div className="headerRight">
              {/* <Link to="/settings"> */}
              {/*   <div className="headerRight__settings"> */}
              {/*     <Settings size={21} /> */}
              {/*   </div> */}
              {/* </Link> */}
              {/**/}
              {/* <Link to="/profile"> */}
              {/*   <div className="headerRight__profile"> */}
              {/*     <User size={21} /> */}
              {/*   </div> */}
              {/* </Link> */}
              <Button
                leftSection={<LogOut size={21} />}
                className="headerRight__logout"
                onClick={handleLogout}
              >
                <div>logout</div>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
