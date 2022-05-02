import { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Card from "../UI/Card";
import styles from "./styles.module.css";

function NewPost() {
  const [isPosted, setIsPosted] = useState()

  // Store firstName and lastName locally from localStorage, which will be used as the value for the author key when submitting the post to Firebase
  const firstName = localStorage.getItem("firstName");
  const lastName = localStorage.getItem("lastName");

  // Refs for both input fields on the on the new post form
  const titleInputRef = useRef();
  const contentInputRef = useRef();

  // This submithandler is triggered for the form button for adding a new post
  const submitHandler = async (event) => {
    event.preventDefault();

    // Create a uniqueId for the post using uuidv4
    const uniqueId = uuidv4();

    // enteredPostData (object) will contain the body for the request below which will submit the postData to the Firebase database
    const enteredPostData = {
      id: uniqueId,
      // firstName and lastName referenced here
      author: `${firstName} ${lastName}`,
      date: new Date().toLocaleDateString("en-us", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      title: titleInputRef.current.value,
      content: contentInputRef.current.value,
    };

    const response = await fetch(
      `https://simple-blog-299b2-default-rtdb.firebaseio.com/posts/${uniqueId}.json`,
      {
        // POST method assigns a randomly generated ID, which is not desired for this project
        // Alternatively, PUT method is used to assign the previously created uniqueID as the ID for the post entry into the database
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(enteredPostData),
      }
    );

    // Error Handling
    if (!response.ok) {
      alert(`An error has occured. (${response.status})`);
      return;
    }

    const data = await response.json();

    // Reset input field values to empty
    titleInputRef.current.value = "";
    contentInputRef.current.value = "";
    // Add some kind of response that shows whether the post was posted or not
    setIsPosted(true)
  };

  return (
    <Card className={styles["form-card"]}>
      <form className={styles.form} onSubmit={submitHandler}>
        <label htmlFor="title">Title</label>
        <input typeof="text" id="title" ref={titleInputRef} required />

        <label htmlFor="content">Body</label>
        <textarea
          typeof="text"
          id="contet"
          rows={10}
          required
          ref={contentInputRef}
        />
        <button>Add Post</button>
        {isPosted && <p className="success-text">Post successfully added!</p>}
      </form>
    </Card>
  );
}

export default NewPost;
