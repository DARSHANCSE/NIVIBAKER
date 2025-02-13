import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import RegisterPage from "./pages/Signup.tsx";
import LoginPage from "./pages/LoginPage.tsx";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegisterPage />}></Route>
        <Route path="/*" element={<LoginPage />}></Route>

      </Routes>
    </BrowserRouter>
  );
}
export default App;
