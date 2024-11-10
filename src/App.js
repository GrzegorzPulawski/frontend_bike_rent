import classes from "./App.module.css";
import AppHeader from "./components/header/AppHeader";
import React from "react";
import AppBody from "./components/body/AppBody";
import AuthContent from "./components/security/AuthContent";

function App() {
  return (
      <div className={classes.App}>
        <AppHeader/>
        <AppBody/>
      </div>
  );
}
export default App;
