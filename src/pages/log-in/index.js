// path ==> /log-in

import Head from "next/head";
import { useEffect } from "react";
import styles from "./index.module.css";
import MainNavigation from "../../components/MainNavigation";
import AuthForm from "../../components/AuthForm";
import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "../../store/auth-slice";

function LogIn(props) {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.authentication.isLoggedIn);

  // useEffect below executes on the initial render of AddPost and whenever it mounts/unmounts from the screen
  useEffect(() => {
    // Check if the user is authenticated by checking if the localStorage has a value for the idToken key
    const userLoggedIn = Boolean(localStorage.getItem("idToken"));
    // dispatch the app wide login function if the userLoggedIn value is true
    if (userLoggedIn) {
      dispatch(login());
    }
  }, [dispatch]);

  // logoutHandler function which is meant to clear the key and values stored on localStorage and dispatch the app wide logout function
  // sets app wide authentication state (isLoggedIn) to false
  const logoutHandler = () => {
    localStorage.clear();
    dispatch(logout());
  };

  return (
    <div>
      <Head>
        <title>Simple Blog - Login</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <MainNavigation>
        {!isLoggedIn ? (
          <AuthForm />
        ) : (
          <div className="center-text content-body">
            <h1>You are already logged in.</h1>
            <p>
              Did you want to{" "}
              <a className={styles.action} onClick={logoutHandler}>
                log out?
              </a>
            </p>
          </div>
        )}
      </MainNavigation>
    </div>
  );
}

export default LogIn;
