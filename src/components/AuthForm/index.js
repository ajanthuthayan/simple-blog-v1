import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../store/auth-slice";
import Card from "../UI/Card";
import styles from "./styles.module.css";
import { useRouter } from "next/router";

// Note, this key is exposed to the client side
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

function AuthForm() {
  const dispatch = useDispatch();
  const router = useRouter();

  // State to manage whether the user is new or returning
  // Since default flow would be that the user isn't new, isNewUser is false initially
  const [isNewUser, setIsNewUser] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const [error, setError] = useState({ message: null, status: false });
  const [success, setSuccess] = useState({ message: null, status: false });

  // Refs used for input fields in isNewUser and !isNewUser states
  const firstNameInputRef = useRef();
  const lastNameInputRef = useRef();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const signInHandler = async (event) => {
    // Prevent new request, default behaviour
    event.preventDefault();

    // GET request to Firebase signupNewUser endpoint
    const authResponse = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailInputRef.current.value,
          password: passwordInputRef.current.value,
          returnSecureToken: true,
        }),
      }
    );

    // Error handling
    if (!authResponse.ok) {
      setError({
        message: `An error has occured (${authResponse.status}). Please try again.`,
        status: true,
      });
      return;
    }

    const authData = await authResponse.json();
    const userUID = authData.localId;

    // GET request to Firebase userNames database
    const nameResponse = await fetch(
      `https://simple-blog-299b2-default-rtdb.firebaseio.com/usersNames/${userUID}.json`,
      { method: "GET" }
    );

    // Error handling
    if (!nameResponse.ok) {
      alert(`An error has occured. (${nameResponse.status})`);
      return;
    }

    const nameData = await nameResponse.json();

    // Store the authenticated user's credentials on localStorage
    localStorage.setItem("firstName", nameData.firstName);
    localStorage.setItem("lastName", nameData.lastName);
    localStorage.setItem("userID", userUID);
    localStorage.setItem("idToken", nameData.idToken);

    // Dispatch app wide login function
    if (userExists) {
      dispatch(login());
    }

    // Direct logged in user to root path
    router.replace("/");
  };

  const signUpHandler = async (event) => {
    // Prevent new request, default behaviour
    event.preventDefault();
    // POST request to Firebase verifyPassword endpoint
    const authResponse = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailInputRef.current.value,
          password: passwordInputRef.current.value,
          returnSecureToken: true,
        }),
      }
    );
    console.log(authResponse.statusText)

    // Error handling
    if (!authResponse.ok) {
      setError({
        message: `An error has occured (${authResponse.status}). Please try again.`,
        status: true,
      });
      return;
    }

    const authData = await authResponse.json();

    // User UID
    const userUID = authData.localId;
    const idToken = authData.idToken;

    // POST request to add user first name and last name into db, with id tied to the UID (localId)
    const nameResponse = await fetch(
      // PUT request either creates a new resource or replaces depending on the endpoint so I knew I had to make the endpoint dynamic some how
      `https://simple-blog-299b2-default-rtdb.firebaseio.com/usersNames/${userUID}.json`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstNameInputRef.current.value,
          lastName: lastNameInputRef.current.value,
          idToken: idToken,
        }),
      }
    );

    // Error handling
    if (!nameResponse.ok) {
      alert(`An error has occured. (${nameResponse.status})`);
      return;
    }

    router.replace("/log-in");
    setSuccess({ message: "Account successfully registered!", status: true });

    // Reset text field boxes
    firstNameInputRef.current.value = "";
    lastNameInputRef.current.value = "";
    emailInputRef.current.value = "";
    passwordInputRef.current.value = "";
  };

  // This handler function is what changes state from the default state of isNewUser = false to true
  const triggerRegisterHandler = () => {
    setIsNewUser((prevState) => !prevState);
    setError({
      message: null,
      status: false,
    });
    setSuccess({ message: null, status: false });
  };

  // Form conditions for the form heading and the form button text
  const formHeading = isNewUser ? "Register " : "Log In";
  const formButton = isNewUser ? "Sign Up " : "Sign In";

  return (
    <Card className={styles["auth-form-card"]}>
      <form
        onSubmit={isNewUser ? signUpHandler : signInHandler}
        className={styles.form}
      >
        {/* center is a global class */}
        <h2 className="center-text">{formHeading}</h2>

        {isNewUser && (
          <div>
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              ref={firstNameInputRef}
              required
            />
          </div>
        )}

        {isNewUser && (
          <div>
            <label htmlFor="lastName">Last Name</label>
            <input type="text" id="lastName" ref={lastNameInputRef} required />
          </div>
        )}

        <label htmlFor="email">Email</label>
        <input type="email" id="email" ref={emailInputRef} required />

        <label htmlFor="password">Password</label>
        <input type="password" id="password" ref={passwordInputRef} required />

        <button>{formButton}</button>
        {!isNewUser && (
          <div className={styles["action-text-container"]}>
            <a onClick={triggerRegisterHandler} className="center">
              Don&apos;t have an account? Register here!
            </a>
          </div>
        )}

        {isNewUser && (
          <div className={styles["action-text-container"]}>
            <a onClick={triggerRegisterHandler} className="center">
              Have an account? Sign in here!
            </a>
          </div>
        )}
        {error.status && <p className="error-text">{error.message}</p>}
        {success.status && <p className="success-text">{success.message}</p>}
      </form>
    </Card>
  );
}

export default AuthForm;
