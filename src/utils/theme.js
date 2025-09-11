import { extendTheme } from "@chakra-ui/react";

const customTheme = extendTheme({
  colors: {
    brand: {
      50: "#e3f9f0",
      100: "#c1eeda",
      200: "#9de4c4",
      300: "#77d9ad",
      400: "#4dce97",
      500: "#33b47d",
      600: "#268c61",
      700: "#1a6446",
      800: "#0d3c2b",
      900: "#00150f",
    },
  },
  fonts: {
    heading: "'Poppins', sans-serif",
    body: "'Inter', sans-serif",
  },
});
export default customTheme;