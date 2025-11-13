import React from "react";
import { Route } from "react-router-dom";
import Landing from "../pages/Landing";
import Cart from "../pages/cart";
import About from "../pages/About";
import Blog from "../pages/Blog";
import Contact from "../pages/Contact";
import UserProfile from "../pages/UserProfile";
import Schedule from "../pages/Schedule";
import PurchaseHistory from "../pages/PurchaseHistory";
import Dashboard from "../pages/Dashboard";
import InstructorProfile from "../pages/InstructorProfile";
import ProfessorProfile from "../pages/ProfessorProfile";
import Branches from "../pages/Branches";
import Memberships from "../pages/Memberships";
import Administrators from "../pages/Administrators";

import Activities from "../pages/Activities";
import HomeProfile from "../pages/HomeProfile";
import Routine from "../pages/Routines";

import Categories from "../pages/Categories";
import Classes from "../pages/Classes";
import Clients from "../pages/Clients";
import Excersises from "../pages/Excersises";
import Orders from "../pages/Orders";
import Products from "../pages/Products";
import Profile from "../pages/Profile";
import Routines from "../pages/Routines";
import Instructors from "../pages/Instructors";
import Professors from "../pages/Professors";

import { ProtectedRoute } from "./ProtectedRoute";
import { Routes } from "react-router-dom";

const AppRoutes = () => (
  <Routes>
    {/* Rutas públicas */}
    <Route path="/" element={<Landing />} />
    <Route path="/about" element={<About />} />
    <Route path="/blog" element={<Blog />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/cart" element={<Cart />} />

    <Route path="/activities" element={<Activities />} />
    <Route path="/schedule" element={<Schedule />} />
    <Route path="/historial" element={<PurchaseHistory />} />
    <Route path="/homeProfile" element={<HomeProfile />} />
    <Route path="/perfil" element={<UserProfile />} />
    <Route path="/routine" element={<Routine />} />

    <Route path="/instructor" element={<InstructorProfile />} />
    <Route path="/professor" element={<ProfessorProfile />} />

    <Route path="/dashboard/*" element={<Dashboard />}>
      <Route path="branches" element={<Branches />} />
      <Route path="memberships" element={<Memberships />} />
      <Route path="administrators" element={<Administrators />} />
      <Route path="categories" element={<Categories />} />
      <Route path="classes" element={<Classes />} />
      <Route path="clients" element={<Clients />} />
      <Route path="excersises" element={<Excersises />} />
      <Route path="orders" element={<Orders />} />
      <Route path="products" element={<Products />} />
      <Route path="profile" element={<Profile />} />
      <Route path="routines" element={<Routines />} />
      <Route path="instructors" element={<Instructors />} />
      <Route path="professors" element={<Professors />} />
    </Route>

    {/* Ruta protegida */}
    <Route element={<ProtectedRoute />}>
      {/* Aquí podrías agregar rutas privadas */}
    </Route>
  </Routes>
);

export default AppRoutes;
