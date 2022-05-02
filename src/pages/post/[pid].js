import Head from "next/head";
import MainNavigation from "../../components/MainNavigation";
import styles from "./pid.module.css";
import { useState, useEffect } from "react";
import { login } from "../../store/auth-slice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";

function Post(props) {
  const [post, setPost] = useState({});
  const dispatch = useDispatch();
  const router = useRouter();

  // Extract query parameter as const pid
  const { pid } = router.query;

  // useEffect below executes on the initial render of AddPost and whenever it mounts/unmounts from the screen
  useEffect(() => {
    // Check if the user is authenticated by checking if the localStorage has a value for the idToken key
    const userLoggedIn = Boolean(localStorage.getItem("idToken"));

    // fetchPost uses the fetch API to find the post with the id that corresponds to the query parameter (pid)
    // fetchPost was defined inside the useEffect hook and called after so that async functionality can be used
    const fetchPost = async () => {
      const postResponse = await fetch(
        `https://simple-blog-299b2-default-rtdb.firebaseio.com/posts/${pid}.json`
      );

      // Error Handling
      if (!postResponse.ok) {
        alert(`An error occured ${postResponse.status}.`);
        return;
      }

      const postData = await postResponse.json();
      setPost(postData);
    };

    // dispatch the app wide login function if the userLoggedIn value is true
    if (userLoggedIn) {
      dispatch(login());
    }
    fetchPost();
  }, [dispatch, pid]);

  return (
    <div>
      <Head>
        <title>Simple Blog - {post.title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <MainNavigation>
        <div className={`center-text ${styles["content-body"]}`}>
          <h1 className={styles.title}>{post.title}</h1>
          <h2 className={styles.author}>{post.author}</h2>
          <h2 className={styles.date}>{post.date}</h2>
          <p className={styles.content}>{post.content}</p>
          <Link href="/" passhref>
            <a className={styles["action-button"]}>Go back</a>
          </Link>
        </div>
      </MainNavigation>
    </div>
  );
}

export default Post;
