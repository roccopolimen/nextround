import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./app.css";
import "./styleguide.css"
import { Landing } from "./components/landing/Landing"

function app() {
  return (
    <>
      <Landing />
    </>
  );
}

export default app;