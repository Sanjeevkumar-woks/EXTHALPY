import ChatUI from "./components/chat";
import CloneInteraction from "./components/CloneInteraction";
import Dashboard from "./components/dashboard";
import HomePage from "./components/homepage";
import Sidebar from "./components/sidebar";
import VoiceAssistance from "./components/VoiceAssistance";

import { Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/CloneInteraction" element={<CloneInteraction />} />
      </Routes>
    </div>
  );
};

export default App;
