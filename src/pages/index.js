// localhost:3000/
import { useState, useEffect } from "react";
import styles from "./index.module.css";
import MainNavigation from "../components/MainNavigation/index";
import PostPreview from "../components/PostPreview";
import { useDispatch } from "react-redux";
import { login } from "../store/auth-slice";
import Head from "next/head";
import Link from "next/link";

function Home() {
  const [posts, setPosts] = useState([]);
  const dispatch = useDispatch();

  // useEffect below executes on the initial render of AddPost and whenever it mounts/unmounts from the screen
  useEffect(() => {
    const fetchedPosts = [];

    // Check if the user is authenticated by checking if the localStorage has a value for the idToken key
    const userLoggedIn = Boolean(localStorage.getItem("idToken"));

    // fetchPosts was defined inside the useEffect hook and called after so that async functionality can be used
    const fetchPosts = async () => {
      const response = await fetch(
        "https://simple-blog-299b2-default-rtdb.firebaseio.com/posts.json"
      );

      // Error handling
      if (!response.ok) {
        alert(`An error has occured. (${response.status})`);
        return;
      }

      const postsData = await response.json();
      // For loop that loops through all posts on the Firebase database, and pushes it into the local variable fetchedPosts (array)
      for (const id in postsData) {
        fetchedPosts.push(postsData[id]);
      }
      // Once the for loop is completed and the fetchedPosts array contains all the posts, the posts state is updated with all the posts in fetchedPosts
      setPosts(fetchedPosts);
    };

    // dispatch the app wide login function if the userLoggedIn value is true
    if (userLoggedIn) {
      dispatch(login());
    }

    fetchPosts();
  }, [dispatch]);

  return (
    <div>
      <Head>
        <title>Simple Blog</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <MainNavigation>
        <div className={styles["content-container"]}>
          {/* Map all the posts in the "posts" state */}
          {posts.length > 0 &&
            posts.map((postData) => (
              <PostPreview
                key={postData.id}
                id={postData.id}
                title={postData.title}
                author={postData.author}
                date={postData.date}
                content={postData.content}
              />
            ))}
          {!posts.length > 0 && (
            <div className="center-text content-body">
              <h1>No posts found.</h1>
              <Link href="/add-post" replace passHref>
                <button className={styles.button}>Add Post</button>
              </Link>
            </div>
          )}
        </div>
      </MainNavigation>
    </div>
  );
}

export default Home;
