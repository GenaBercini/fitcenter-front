import React from "react";
import { Routes, Route } from "react-router-dom";

// Páginas Públicas y de Socio
import Landing from "../pages/Landing";
import Cart from "../pages/Cart";
import About from "../pages/About";
import Blog from "../pages/Blog";
import Contact from "../pages/Contact";
import UserProfile from "../pages/UserProfile";
import Schedule from "../pages/Schedule";
import PurchaseHistory from "../pages/PurchaseHistory";
import HomeProfile from "../pages/HomeProfile";
import Activities from "../pages/Activities";
import Routines from "../pages/Routines";
import MembershipPlan from "../pages/MembershipPlan";
import CheckoutSuccess from "../pages/CheckoutSuccess";
import CheckoutCancel from "../pages/CheckoutCancel";

// Perfiles por Rol
import InstructorProfile from "../pages/InstructorProfile";
import ProfessorProfile from "../pages/ProfessorProfile";

// Panel de Administración (Dashboard)
import Dashboard from "../pages/Dashboard";
import Main from "../pages/Main";
import Administrators from "../pages/Administrators";
import AdminCategories from "../pages/AdminCategories";
import AdminClients from "../pages/AdminClients";
import AdminProducts from "../pages/AdminProducts";
import AdminInstructors from "../pages/AdminInstructors";
import AdminProfessors from "../pages/AdminProfessors";

// Vistas Internas del Dashboard (Nuevas importaciones)
import AdminMemberships from "../pages/AdminMemberships";
import AdminSchedules from "../pages/AdminSchedules";
import AdminClasses from "../pages/AdminClasses";
import AdminRoutines from "../pages/AdminRoutines";
import AdminExercises from "../pages/AdminExercises";

import { ProtectedRoute } from "./ProtectedRoute";

const AppRoutes = () => (
  <Routes>
    {/* RUTAS PÚBLICAS Y SOCIO */}
    <Route path="/" element={<Landing />} />
    <Route path="/about" element={<About />} />
    <Route path="/blog" element={<Blog />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/myPurchases" element={<PurchaseHistory />} />
    <Route path="/activities" element={<Activities />} />
    <Route path="/schedule" element={<Schedule />} />
    <Route path="/home" element={<HomeProfile />} />
    <Route path="/profile" element={<UserProfile />} />
    <Route path="/routine" element={<Routines />} />
    <Route path="/memberships" element={<MembershipPlan />} />

    {/* PERFILES PRIVADOS */}
    <Route path="/instructor" element={<InstructorProfile />} />
    <Route path="/professor" element={<ProfessorProfile />} />

    {/* PASARELA DE PAGO */}
    <Route path="/checkout/success" element={<CheckoutSuccess />} />
    <Route path="/checkout/cancel" element={<CheckoutCancel />} />
    <Route path="/membership/success" element={<CheckoutSuccess />} />
    <Route path="/membership/cancel" element={<CheckoutCancel />} />

    {/* PANEL DE ADMINISTRACIÓN */}
    <Route path="/dashboard/*" element={<Dashboard />}>
      <Route path="main" element={<Main />} />
      <Route path="memberships" element={<AdminMemberships />} />
      <Route path="schedule" element={<AdminSchedules />} />
      <Route path="profile" element={<UserProfile />} />
      <Route path="classes" element={<AdminClasses />} />
      <Route path="routines" element={<AdminRoutines />} />
      <Route path="exercises" element={<AdminExercises />} />
      <Route path="categories" element={<AdminCategories />} />
      <Route path="products" element={<AdminProducts />} />
      <Route path="clients" element={<AdminClients />} />
      <Route path="administrators" element={<Administrators />} />
      <Route path="instructors" element={<AdminInstructors />} />
      <Route path="professors" element={<AdminProfessors />} />
    </Route>

    <Route element={<ProtectedRoute />}>{/* Subrutas privadas */}</Route>
  </Routes>
);

export default AppRoutes;
