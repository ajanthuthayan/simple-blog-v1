// path ==> /add-post

import Head from "next/head";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../../store/auth-slice";
import MainNavigation from "../../components/MainNavigation/index";
import NewPost from "../../components/NewPost";

function AddPost() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.authentication.isLoggedIn);

// useEffect below executes on the initial render of AddPost and whenever it mounts/unmounts from the screen
  useEffect(() => {
    // Check if the user is authenticated by checking if the localStorage has a value for the idToken key
    const userLoggedIn = Boolean(localStorage.getItem("idToken"));
    if (userLoggedIn) {
      // dispatch the app wide login function if the userLoggedIn value is true
      dispatch(login());
    }
  }, [dispatch]);

  return (
    <div>
      <Head>
        <title>Simple Blog - Add Post</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <MainNavigation>
        {isLoggedIn && <NewPost />}
        {!isLoggedIn && (
          <h2 className="center-text content-body">Insufficient Permissions</h2>
        )}
      </MainNavigation>
    </div>
  );
}

export default AddPost;
