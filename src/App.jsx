import { useState } from 'react'
import './assets/styles/App.css'
import Login from './components/Login'
import { Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import MultiStepForm from './components/MultiStepForm'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/registrar-credito" element={<MultiStepForm />} />
      </Routes>
    </>
  )
}

export default App