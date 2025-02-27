import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUser } from "../features/auth/authSlice";
import { useEffect } from "react";
import { useLazyCheckAuthQuery } from "../features/auth/authApiSlice";

const PrivateRoute = () => {
  const currentUser = useSelector(getUser);

  const [trigger, { isError }] = useLazyCheckAuthQuery();

  useEffect(() => {
    trigger();
  }, [trigger]);

  return currentUser ? (
    <Outlet />
  ) : isError ? (
    <Navigate to="/login" replace></Navigate>
  ) : (
    <div>Loading chat</div>
  );
};

export default PrivateRoute;
