import "./App.css";
import { BrowserRouter as Router, Routes } from "react-router-dom";
import { rutas } from "./routing/rutas";
import NavBar from "./components/Layaut/NavBar";
import Footer from "./components/Layaut/Footer";
import { Flex } from "@chakra-ui/react";

function App() {
  return (
    <>
      <NavBar />
      {/* <Router> */}
      <Routes>{rutas}</Routes>
      {/* </Router>, */}
      <Footer />
    </>
  );
}
export default App;
