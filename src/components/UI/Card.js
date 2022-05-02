import styles from "./Card.module.css"

// Card component acts as a UI wrapper for other components
function Card(props) {

// General styling applies via styles.card, however additional styling can be added/overwritten via the props.className where the Card component is used
  return <div className={`${styles.card} ${props.className}`}>{props.children}</div>;
}

export default Card;
