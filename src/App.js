import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Pointage from "./Components/Pointage";
import Consultation from "./Components/Consultasion";
import Login from "./Login/SignIn";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route path="/pointage" element={<Pointage />} />
            <Route path="/consultation" element={<Consultation />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
