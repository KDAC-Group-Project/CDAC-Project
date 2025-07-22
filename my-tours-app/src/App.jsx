import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LoginPage from './pages/auth/LoginPage'
import { AuthContext } from './contexts/AuthContext'
import { Route,Routes } from 'react-router-dom'
import RegisterPage from './pages/auth/RegisterPage'

function App() {
  const[user, setUser] = useState(null)

  return (
    <>
    <AuthContext value={{ user, setUser }}>
      <Routes>
          <Route
            path='/'
            element={<LoginPage />}
          />
          <Route
            path='register'
            element={<RegisterPage />}
          />
      </Routes>
    </AuthContext>
    </>
  )
}

export default App
