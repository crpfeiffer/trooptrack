import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Meetings from "./pages/Meetings";
import Activities from "./pages/Activities";
import Volunteers from "./pages/Volunteers";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav className="navbar">
          <h1>TroopTrack</h1>
          <div className="nav-links">
            <Link to="/">Dashboard</Link>
            <Link to="/meetings">Meetings</Link>
            <Link to="/activities">Activities</Link>
            <Link to="/volunteers">Volunteers</Link>
          </div>
        </nav>

        <main className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/meetings" element={<Meetings />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/volunteers" element={<Volunteers />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;