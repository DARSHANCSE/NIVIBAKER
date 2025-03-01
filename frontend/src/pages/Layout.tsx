import {  Navigate, Route, Routes } from "react-router-dom";
import MyHeader from "./Header";
import Home from "./Home";
import ProductsPage from "./Products";
import LoginPage from "./LoginPage";
import CartPage from "./cart";
import ProfilePage from "./profile";

export interface MainLayoutProps {
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    isAuthenticated: boolean;
  }



const MainLayout = ( {setIsAuthenticated,isAuthenticated}:MainLayoutProps ) => {
  console.log('authenticated:', isAuthenticated)
    return (
    <div className="flex flex-col h-screen">
      <MyHeader />
        <Routes>
          <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<Navigate to="/register" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/products" element={<ProductsPage />} /> 
          <Route path="/*" element={<Navigate to="/home" />} /> 
          <Route path="/cart" element={<CartPage />} />  
          <Route path="/profile" element={<ProfilePage/>} />
        </Routes>
    </div>
  );
}

export default MainLayout;