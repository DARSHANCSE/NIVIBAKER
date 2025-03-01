import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useState } from "react";
import RegisterPage from "./pages/Signup.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import MainLayout from "./pages/Layout.tsx";
import { useEffect } from "react";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    console.log(localStorage.getItem('user'));
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <BrowserRouter>
      <Routes>
        {!isAuthenticated ? (
          <>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/*" element={<Navigate to="/login" />} />
          </>
        ) : (
          <>  
            
            <Route path="/*" element={<MainLayout setIsAuthenticated={setIsAuthenticated} isAuthenticated={isAuthenticated} />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
