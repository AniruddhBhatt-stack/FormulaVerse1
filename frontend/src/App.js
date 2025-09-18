import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './components/Landing'
import AuthSuccess from './components/AuthSuccess'
import Chat from './components/Chat'

function App(){
  return (
    <BrowserRouter>
      <div className="app">
        {/* <header className="header">
          <strong>MathNarrator</strong>
        </header> */}
        <div className="container">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth/success" element={<AuthSuccess />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
