import { useState } from 'react'
import './App.css';
import ChatComponent from './components/chatcomponent';

function App() {
  return (
    <>
       <div className="max-w-lg mt-20 mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg overflow-hidden">
        <ChatComponent />
      </div>
    </div>
    </>
  )
}

export default App
