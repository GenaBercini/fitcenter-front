export const API_URL = import.meta.env.VITE_API_URL || "https://fitcenter-back.onrender.com";

// Las imágenes de productos pueden venir de dos formas:
// - Una URL completa (https://...), por ejemplo de Supabase.
// - Solo el nombre del archivo (image-123.jpg), que el back guarda en /uploads.
// Esta función devuelve siempre una URL que el navegador puede cargar.
export const getImageUrl = (img) => {
  if (!img) return "";
  if (/^(https?:|blob:|data:)/.test(img)) return img;
  return `${API_URL}/uploads/${img}`;
};

export default API_URL;
