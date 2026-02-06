import { useState } from 'react'
import './App.css';
import ChatComponent from './components/chatcomponent';

function App() {
  return (
   <div className="flex h-screen w-screen overflow-hidden">
      {/* Chat Area */}
      <div className="flex-1 bg-gray-50">
        <ChatComponent />
      </div>
    </div>
  )
}

export default App
