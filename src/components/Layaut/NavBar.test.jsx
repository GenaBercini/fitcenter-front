import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { MemoryRouter } from "react-router-dom";
import NavBar from "./NavBar";
import { useAuth } from "../../context/AuthContext";

// Mockeamos el hook useAuth para controlar el estado de usuario en cada test
vi.mock("../../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

// Mockeamos useNavigate, pero dejamos el resto de react-router-dom real
// (necesitamos <Link> y <MemoryRouter> funcionando de verdad)
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Helper: renderiza NavBar con los providers que necesita para funcionar
function renderNavBar() {
  return render(
    <ChakraProvider>
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    </ChakraProvider>,
  );
}

describe("NavBar", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('muestra el botón "Acceder" cuando no hay usuario logueado', () => {
    useAuth.mockReturnValue({
      isAuthModalOpen: false,
      openAuthModal: vi.fn(),
      closeAuthModal: vi.fn(),
      user: null,
      signOut: vi.fn(),
    });

    renderNavBar();

    expect(screen.getByText("Acceder")).toBeInTheDocument();
  });

  it('llama a openAuthModal al hacer click en "Acceder"', () => {
    const openAuthModal = vi.fn();
    useAuth.mockReturnValue({
      isAuthModalOpen: false,
      openAuthModal,
      closeAuthModal: vi.fn(),
      user: null,
      signOut: vi.fn(),
    });

    renderNavBar();
    fireEvent.click(screen.getByText("Acceder"));

    expect(openAuthModal).toHaveBeenCalledTimes(1);
  });

  it('muestra el avatar del usuario y oculta "Acceder" cuando hay sesión iniciada', () => {
    useAuth.mockReturnValue({
      isAuthModalOpen: false,
      openAuthModal: vi.fn(),
      closeAuthModal: vi.fn(),
      user: { role: "client", image_url: "foto.jpg" },
      signOut: vi.fn(),
    });

    renderNavBar();

    expect(screen.queryByText("Acceder")).not.toBeInTheDocument();
    expect(screen.getByRole("img", { name: /avatar/i })).toBeInTheDocument();
  });

  it('cierra sesión y redirige a "/" al hacer click en "Cerrar Sesión"', async () => {
    const signOut = vi.fn();
    useAuth.mockReturnValue({
      isAuthModalOpen: false,
      openAuthModal: vi.fn(),
      closeAuthModal: vi.fn(),
      user: { role: "client", image_url: "foto.jpg" },
      signOut,
    });

    renderNavBar();

    // Abrimos el menú del avatar
    fireEvent.click(screen.getByRole("img", { name: /avatar/i }));

    // El item del menú aparece de forma asincrónica (animación de Chakra)
    const cerrarSesion = await screen.findByText("Cerrar Sesión");
    fireEvent.click(cerrarSesion);

    expect(signOut).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
