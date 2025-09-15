import { HashRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login";
import Note from "./pages/note";
import Dashboard from "./pages/dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage/>}/>
        <Route path="/note" element={<Note/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
      </Routes>
    </Router>
  );
}
export default App;
