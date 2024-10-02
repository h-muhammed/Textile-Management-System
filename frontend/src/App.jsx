import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AddProduct from "./pages/AddProduct";
import { NavigationBar } from "./components/NavigationBar";
import Dashboard from "./pages/DiscountDashboard";
import ProductList from "./components/ProductList";
import CartPage from "./pages/CartPage";
import OrderConfirmation from "./pages/OrderConfirmation";
import ViewProducts from "./pages/ViewProducts";
import UpdateProduct from "./pages/UpdateProduct";
import ProductDetail from "./pages/ProductDetail";
import { Footer } from "./components/Footer";
import Chatbot from "./pages/ChatBot";
import Login from "../src/components/User/Login";
import UserProfile from "../src/components/User/UserProfile";
import UpdateUserProfile from "../src/components/User/UpdateUserDetails";
import OrdersDoneByTheUser from "../src/pages/OrdersDoneByTheUser";
import AboutUs from "./pages/AboutUs";
import MostLeastSoldItems from "../src/pages/MostLeastSoldItems";
import PrivateRoute from "./components/PrivateRoute/PrivateRouteUser";
import AdminPrivateRoute from "./components/PrivateRoute/PrivateRouteAdmin";

export default function App() {
  return (
    <BrowserRouter>
      <NavigationBar />
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<Home />} />
          <Route element={<AdminPrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/aibot" element={<Chatbot />} />
          </Route>
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/userProfile" element={<UserProfile />} />
          <Route path="/updateProfile/:id" element={<UpdateUserProfile />} />
          <Route
            path="/OrdersDoneByTheUser"
            element={<OrdersDoneByTheUser />}
          />
          <Route path="/MostLeastSoldItems" element={<MostLeastSoldItems />} />
          <Route path="/home" element={<Home />} />
          <Route path="/ProductList" element={<ProductList />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/confirm-order" element={<OrderConfirmation />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/products" element={<ViewProducts />} />
          <Route path="/update-product/:id" element={<UpdateProduct />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Route>

        {/* user routes */}
        <Route path="/" element={<Login />} />
        <Route path="/user" element={<Login />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
