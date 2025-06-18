import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './components/common/Layout';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { ChatInterface } from './components/chat/ChatInterface';

// Placeholder components - we'll implement these in the next steps
const StatsPage = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Chat Statistics</h1>
    <p className="text-gray-600 dark:text-gray-400 mt-2">Statistics dashboard will be implemented next.</p>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/chat" replace />} />
              <Route
                path="chat"
                element={
                  <ProtectedRoute>
                    <div className="h-[calc(100vh-4rem)]">
                      <ChatInterface />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="stats"
                element={
                  <ProtectedRoute>
                    <StatsPage />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;