import "./App.css";
import NavBar from "./components/Layaut/NavBar";
import Footer from "./components/Layaut/Footer";
import AppRoutes from "./routing/AppRoutes";

function App() {
  return (
    <>
      <NavBar />
      <AppRoutes />
      <Footer />
    </>
  );
}
export default App;
