import { render } from "preact";
import Router from "preact-router";

import "./styles/index.css";
import "./styles/fonts.css";

import Home from "./pages/Home";
import Learn from "./pages/Learn";
import Train from "./pages/Train";
import Sandbox from "./pages/Sandbox";
import Settings from "./pages/Settings";

const App = () => (
  <Router>
    <Home path="/" />
    <Learn path="/learn" />
    <Train path="/train" />
    <Sandbox path="/sandbox" />
    <Settings path="/settings" />
  </Router>
);

render(<App />, document.getElementById("root")!);