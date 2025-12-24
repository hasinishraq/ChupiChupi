import React from "react";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  return (
    <div className="app-shell">
      <div className="bg-orbs" aria-hidden="true">
        <span className="orb orb-one" />
        <span className="orb orb-two" />
        <span className="orb orb-three" />
      </div>
      <Navbar />
      <main className="app-main">
        <AppRoutes />
      </main>
      <footer className="app-footer">Made for honest questions, asked freely.</footer>
    </div>
  );
};

export default App;
