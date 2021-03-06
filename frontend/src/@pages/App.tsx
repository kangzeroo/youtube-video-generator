import React, { useEffect } from "react";
import logo from "logo.svg";
import "./App.css";
import { heartbeat } from "@api/helper";
import Demo from "@components/demo";

function App() {
  useEffect(() => {
    heartbeat();
  });
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <Demo />
      </header>
    </div>
  );
}

export default App;
