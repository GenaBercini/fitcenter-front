import React from "react";
import { Route } from "react-router-dom";
import Landing from "../pages/Landing";
import Cart from "../pages/cart";
import HomeView from "../pages/HomeView";
import About from "../pages/About";
import Blog from "../pages/Blog";
import Contact from "../pages/Contact";
import UserProfile from "../pages/UserProfile";
import Booking from "../pages/Booking";
import ScheduledAppoiments from "../pages/ScheduledAppointments";
import PurchaseHistory from "../pages/PurchaseHistory";
import Turns from "../components/Landing/Turns";
import Dashboard from "../pages/Dashboard";

import Branches from "../pages/Branches";
import Memberships from "../pages/Memberships";
import Administrators from "../pages/Administrators";
import Bookings from "../pages/Bookings";
import Categories from "../pages/Categories";
import Classes from "../pages/Classes";
import Clients from "../pages/Clients";
import Excersises from "../pages/Excersises";
import Instructors from "../pages/Instructors";
import Orders from "../pages/Orders";
import Products from "../pages/Products";
import Professors from "../pages/Professors";
import Profile from "../pages/Profile";
import Routines from "../pages/Routines";


import { ProtectedRoute } from "./ProtectedRoute";


export const rutas = [
  <>
    {/* Rutas publicas */}
    <Route path="/" element={<Landing />} />
    <Route path="/about" element={<About />} />
    <Route path="/blog" element={<Blog />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/profile" element={<HomeView />} />

    <Route path="/perfil" element={<UserProfile />} />
    <Route path="/turno" element={<Turnos />} />
    <Route path="/agendados" element={<TurnosAgendados />} />
    <Route path="/historial" element={<HistorialCompra />} />
      
    <Route path="/dashboard/*" element={<Dashboard/>}>
      <Route path="branches" element={<Branches />} />
      <Route path="memberships" element={<Memberships />} />
      <Route path="administrators" element={<Administrators />} />
      <Route path="bookings" element={<Bookings />} />
      <Route path="categories" element={<Categories />} />
      <Route path="classes" element={<Classes />} />
      <Route path="clients" element={<Clients />} />
      <Route path="excersises" element={<Excersises />} />
      <Route path="instructors" element={<Instructors />} />
      <Route path="orders" element={<Orders />} />
      <Route path="products" element={<Products />} />
      <Route path="professors" element={<Professors />} />
      <Route path="profile" element={<Profile />} />
      <Route path="routines" element={<Routines />} />
    </Route>

    <Route path="/users" element={<UserProfile />} />
    <Route path="/booking" element={<Booking />} />
    <Route path="/agendados" element={<ScheduledAppoiments />} />
    <Route path="/historial" element={<PurchaseHistory />} />
    <Route path="/turns" element={<Turns />} />
    {/* Rutas privadas */}
    <Route element={<ProtectedRoute />}></Route>
  </>,
];
