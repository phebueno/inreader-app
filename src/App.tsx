import { AuthProvider } from "@/contexts/AuthContext";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Dashboard from "@/pages/Dashboard";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<div>Login Page!</div>} />          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />          
          <Route path="/" element={<Navigate to="/login" replace />} />          
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
