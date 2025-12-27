import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/context/AuthContext.jsx';
import './App.css';
import Navbar from './components/navbar/navbar.jsx';
import Footer from './components/footer/Footer.jsx';
import Home from './components/home/Home.jsx';
import About from './components/about/About.jsx';
import ProductsPage from './components/products/ProductsPage.jsx';
import Cart from './components/cart/Cart.jsx';
import Login from './components/login/Login.jsx';
import Register from './components/Register/Register.jsx';
import ForgotPassword from './components/password/ForgotPassword.jsx';
import ResetPassword from './components/password/ResetPassword.jsx';
import Admin from './components/admin/Admin.jsx';
import Orders from './components/orders/Orders.jsx';
import OrderDetail from './components/orders/OrderDetail.jsx';
import Checkout from './components/orders/Checkout.jsx';
import Contact from './components/Contact/Contact.jsx';
import ChatButton from './components/chat/ChatButton.jsx';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import PageFlip from "./pagefilp/pagefilip.jsx";






function App() {
  const location = useLocation();

  return (
    <AuthProvider>


      <div className="jansanApp">
        <ToastContainer />
        <Navbar />
        <AnimatePresence mode="wait" >
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageFlip><Home /></PageFlip>} />
            <Route path="/about" element={<PageFlip><About /></PageFlip>} />
            <Route path="/products" element={<PageFlip><ProductsPage /></PageFlip>} />
            <Route path="/cart" element={<PageFlip><Cart /></PageFlip>} />
            <Route path="/login" element={<PageFlip><Login /></PageFlip>} />
            <Route path="/register" element={<pageFlip><Register /></pageFlip>} />
            <Route path="/forgot-password" element={<pageFlip><ForgotPassword /></pageFlip>} />
            <Route path="/reset-password" element={<pageFlip><ResetPassword /></pageFlip>} />
            <Route path="/admin" element={<pageFlip><Admin /></pageFlip>} />
            <Route path="/orders" element={<pageFlip> <Orders /> </pageFlip>} />
            <Route path="/order/:orderId" element={<pageFlip> <OrderDetail /> </pageFlip>} />
            <Route path="/checkout" element={<pageFlip> <Checkout /> </pageFlip>} />
            <Route path="/contact" element={<pageFlip> <Contact /> </pageFlip>} />
            {/* <Route path="/orders" element={<pageFlip> <Orders /> </pageFlip>} /> */}
          </Routes>
        </AnimatePresence>
        {/* Chat Button - Global Component */}
        <ChatButton />
        <Footer />
      </div>




    </AuthProvider>

  );
}

export default App;
