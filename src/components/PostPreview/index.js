import Card from "../UI/Card";
import styles from "./styles.module.css";
import Link from "next/link";

function PostPreview(props) {
  const path = `/post/${props.id}`;
  return (
    <Card className={styles["post-card"]}>
      <h2 className={styles.title}>{props.title}</h2>
      <h4 className={styles.author}>{props.author}</h4>
      <h4 className={styles.date}>{props.date}</h4>
      <p className={styles.content}>{props.content}</p>
      <div className={styles["actions-container"]}>
        <Link href={path} passHref>
          <a className={styles["action-button"]}>Read More</a>
        </Link>
      </div>
    </Card>
  );
}

export default PostPreview;
