import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Navbar } from './components/layout/Navbar.jsx'
import { Footer } from './components/layout/Footer.jsx'
import { Routes, Route } from 'react-router-dom'

import { LoginForm } from './components/auth/LoginForm.jsx'
import { RegisterForm } from './components/auth/RegisterForm.jsx'

// ---------------- page ----------------
// Remplacement des imports pour correspondre aux fichiers/pages exportés
import { HomePage } from './pages/HomePage.jsx'
import { StatsPage } from './pages/StatsPage.jsx'
import { NewsPage } from './pages/NewsPage.jsx'
import { GameIntroPage } from './pages/GameIntroPage.jsx'
import { ContactPage } from './pages/ContactPage.jsx'
import { AccountPage } from './pages/AccountPage.jsx' 
import { SettingsPage } from './pages/SettingsPage.jsx'




function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar />
      {/* <LoginForm />
      <RegisterForm /> */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/statistique" element={<StatsPage />} />
        <Route path="/actualite" element={<NewsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/compte" element={<AccountPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
