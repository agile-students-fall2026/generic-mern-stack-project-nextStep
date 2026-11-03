import './App.css'
import { BrowserRouter as Router, Navigate, Routes, Route } from 'react-router-dom'
import Login from './Login'
import SignUp from './SignUp'
import Home from './Home'
import { AuthProvider } from './assets/AuthProvider'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home" element={<Home />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
