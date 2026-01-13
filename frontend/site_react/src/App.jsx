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
import { NewsPage2 } from './pages/NewsPage2.jsx'
import { NewsPage3 } from './pages/NewsPage3.jsx'
import { NewsDetailPage } from './pages/NewsDetailPage.jsx'

import { GameIntroPage } from './pages/GameIntroPage.jsx'
import { ContactPage } from './pages/ContactPage.jsx'
import { AccountPage } from './pages/AccountPage.jsx' 
// import { SettingsPage } from './pages/SettingsPage.jsx'

import { ProfilePage} from './components/profile/profil.jsx'
import { SubscriptionPage} from './components/profile/subprofil.jsx'
import  SettingsPage from './components/profile/parametre.jsx'





function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar />
      {/* <LoginForm />
      <RegisterForm /> */}
      {/* <NewsPage /> */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/statistiques" element={<StatsPage />} />
        <Route path="/actualites" element={<NewsPage3 />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/compte" element={<AccountPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/jeux" element={<GameIntroPage />} />
        {/* ----- compte ----- */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/abonnement" element={<SubscriptionPage />} />
        <Route path="/parametres" element={<SettingsPage />} />

        {/* ----- article ----- */}
        <Route path="/articles/:id" element={<NewsDetailPage />} />

      </Routes>
      <Footer />
    </>
  )
}

export default App
