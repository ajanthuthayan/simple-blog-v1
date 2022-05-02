import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import styles from "./Navbar.module.css";
import { logout } from "../../store/auth-slice";

// Navbar component for the application, which will appear at the top of every page regardless of authentication status
function Navbar() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.authentication.isLoggedIn);

  // logoutHandler function which is meant to clear the key and values stored on localStorage and dispatch the app wide logout function
  // sets app wide authentication state (isLoggedIn) to false
  const logoutHandler = () => {
    localStorage.clear();
    dispatch(logout());
  };

  return (
    <header>
      <nav className={styles.nav}>
        <h1>Simple Blog</h1>
        <div className={styles["link-container"]}>
          <ul>
            <li>
              <Link href="/" replace>
                All Posts
              </Link>
            </li>
            {/* Add Post only appears in the navbar if the user is logged in */}
            {isLoggedIn && (
              <li>
                <Link href="/add-post">Add Post</Link>
              </li>
            )}
            {/* Log In appears in the navbar only if the user is not logged in */}
            {!isLoggedIn && (
              <li>
                <Link href="/log-in">Log In</Link>
              </li>
            )}
            {/* Log Out in navbar appears only if user is logged in */}
            {isLoggedIn && (
              <li>
                <Link href="/" replace>
                  <a onClick={logoutHandler}>Log Out</a>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
