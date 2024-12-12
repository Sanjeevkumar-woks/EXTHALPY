import Dashboard from "./components/dashboard";
import Sidebar from "./components/sidebar";

const App = () => {
  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar />
      <div className="flex-grow overflow-auto">
        <Dashboard />
      </div>
    </div>
  );
};

export default App;
