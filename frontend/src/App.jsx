import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

import Login from './pages/Login';
import Register from './pages/Register';
import Terrains from './pages/Terrains';
import Profile from './pages/Profile';
import TerrainDetails from './pages/TerrainDetails';
import AdminTerrains from './pages/AdminTerrains';
import DashboardPage from './pages/Home';

function App() {
  return (
    <div className="app-shell" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navbar */}
      <Navbar />

      {/* Contenu principal */}
      <main className="app-main" style={{ flex: 1 }}>
        <div className="app-main-inner">
          <Routes>
            {/* La route par défaut redirige vers /terrains */}
            <Route path="/" element={<Navigate to="/terrains" />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/terrains" element={<Terrains />} />
            <Route path="/terrains/:id" element={<TerrainDetails />} />
            <Route path="/home" element={<DashboardPage/>} />
            
            
            <Route
              path="/admin/terrains"
              element={
                <ProtectedRoute>
                  <AdminTerrains />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
