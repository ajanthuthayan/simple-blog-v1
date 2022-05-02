import { Fragment } from "react";
import Navbar from "./Navbar";

// Create MainNavigation as a wrapper component to make duplication for pages easier
function MainNavigation(props) {
  return (
    <Fragment>
      <Navbar />
      {props.children}
    </Fragment>
  );
}

export default MainNavigation;
