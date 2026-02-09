import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';

import ChatComponent from './components/chatcomponent';
import ShareChat from './pages/sharechat'; // make sure this file exists

function App() {
  return (
    <Router>
      <div className="flex h-screen w-screen overflow-hidden">

        <div className="flex-1 bg-gray-50">
          <Routes>

            {/* Main Chat */}
            <Route path="/" element={<ChatComponent />} />

            {/* Shared Chat */}
            <Route path="/share/:id" element={<ShareChat />} />

          </Routes>
        </div>

      </div>
    </Router>
  );
}

export default App;
