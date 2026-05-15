import { Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from './store'
import Layout from './components/Layout'
import SelectUser from './pages/SelectUser'
import Home from './pages/Home'
import ActiveWorkout from './pages/ActiveWorkout'
import History from './pages/History'
import Progress from './pages/Progress'
import Exercises from './pages/Exercises'
import Templates from './pages/Templates'

export default function App() {
  const currentUserId = useStore(s => s.currentUserId)
  const users = useStore(s => s.users)

  if (!currentUserId || !users.find(u => u.id === currentUserId)) {
    return <SelectUser />
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/treino" element={<ActiveWorkout />} />
        <Route path="/historico" element={<History />} />
        <Route path="/progresso" element={<Progress />} />
        <Route path="/exercicios" element={<Exercises />} />
        <Route path="/fichas" element={<Templates />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}
