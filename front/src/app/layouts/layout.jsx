import { NavLink, Outlet, useNavigate } from "react-router";
import "./layouts.css";
import { useContext } from "react";
import { AuthContext } from "../../features/auth/provider/auth-provider";
import { ToastContext } from "../../widgets/toast/toast-provider";
import Loader from "../../widgets/loader/loader";

function Layouts() {
  const navigate = useNavigate();
  const { showToast } = useContext(ToastContext);
  const { user, logout, loader, setLoader } = useContext(AuthContext);
  const log = async () => {
    try {
      const data = await logout();
      showToast("удачно вышли", "success");
      navigate("/auth/login");
      return data;
    } catch (error) {
      showToast(error?.response?.data?.error, "error");
      setLoader(false);
    }
  };
  const guest = !user;
  const client = user?.role === "client";
  const manager = user?.role === "manager";
  const admin = user?.role === "admin";
  if (loader) {
    return <Loader />;
  }
  return (
    <div>
      <nav className="nav">
        {guest && (
          <>
            <NavLink to={`/`}>Home</NavLink>
            <NavLink to={`/auth/register`}>Registration</NavLink>
            <NavLink to={`/auth/login`}>Login</NavLink>
          </>
        )}
        {client && (
          <>
            <NavLink to={`/`}>Home</NavLink>
            <NavLink to={`/spaces`}>Spaces</NavLink>
            <NavLink to={`/bookings`}>Bookings</NavLink>
            <NavLink to={`/users/me`}>Me</NavLink>
            <button onClick={log}>Log Out</button>
          </>
        )}
        {manager && (
          <>
            <NavLink to={`/`}>Home</NavLink>
            <NavLink to={`/spaces`}>Spaces</NavLink>
            <NavLink to={`/bookings`}>Bookings</NavLink>
            <NavLink to={`/users/me`}>Me</NavLink>
            <button onClick={log}>Log Out</button>
          </>
        )}
        {admin && (
          <>
            <NavLink to={`/`}>Home</NavLink>
            <NavLink to={`/spaces`}>Spaces</NavLink>
            <NavLink to={`/bookings`}>Bookings</NavLink>
            <NavLink to={`/users/me`}>Me</NavLink>
            <NavLink to={`/users`}>Users</NavLink>
            <button onClick={log}>Log Out</button>
          </>
        )}
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layouts;
