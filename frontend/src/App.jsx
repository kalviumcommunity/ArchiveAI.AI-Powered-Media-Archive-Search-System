import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import AuthPage from './pages/AuthPage'
import SearchPage from './pages/SearchPage'
import SummaryPage from './pages/SummaryPage'
import SourcePage from './pages/SourcePage'
import SettingsPage from './pages/SettingsPage'
import SavedPage from './pages/SavedPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<AuthPage mode="signup" />} />
        <Route path="/signin" element={<AuthPage mode="signin" />} />
        <Route path="/login" element={<Navigate to="/signin" replace />} />
        
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="summary" element={<SummaryPage />} />
          <Route path="source" element={<SourcePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="saved" element={<SavedPage />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
