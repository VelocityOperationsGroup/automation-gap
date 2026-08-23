import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PasswordGate from './components/PasswordGate'
import Landing from './pages/Landing'
import DirectoryPage from './pages/DirectoryPage'
import LeadsPage from './pages/LeadsPage'
import NotFound from './pages/NotFound'

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-ag-ink">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/directory" element={<DirectoryPage />} />
          <Route
            path="/leads"
            element={
              <PasswordGate>
                <LeadsPage />
              </PasswordGate>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
