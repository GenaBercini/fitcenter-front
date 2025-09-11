export const products = [
  {
    id: 1,
    name: "Proteína Whey 2 lb",
    price: 29.99,
    image:
      "https://farmacityar.vtexassets.com/arquivos/ids/243162/143033_suplemento-dietario-whey-protein-sabor-vainilla-en-polvo-x-1000-g__imagen-1.jpg?v=638211443455570000",
  },
  {
    id: 2,
    name: "Creatina Monohidratada",
    price: 19.99,
    image:
      "https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/nrx/nrx00074/y/39.jpg",
  },
  {
    id: 3,
    name: "Guantes de Entreno",
    price: 15.0,
    image:
      "https://www.underarmour.com.ar/on/demandware.static/-/Sites-underarmour_staging/default/dw0c4508bd/new_images/1369830/1369830-IMAGE-1.webp",
  },
  {
    id: 4,
    name: "Bandas Elásticas",
    price: 12.5,
    image:
      "https://acdn-us.mitiendanube.com/stores/966/664/products/s11r1-0602f0f5f984218cca15680574474023-240-0.jpg",
  },
  {
    id: 5,
    name: "Banda elástica resistencia",
    price: 5000,
    image:
      "https://www.wildtravel.cl/cdn/shop/files/1_5b4e9504-179e-479f-b288-0a0eb0bb8ba9_1024x1024@2x.jpg?v=1706278735",
  },
  {
    id: 6,
    name: "Barra de cereal proteica",
    price: 1200,
    image:
      "https://acdn-us.mitiendanube.com/stores/001/172/573/products/1000291757-896e1c8db09d51b82e17242632212534-1024-1024.jpg",
  },
  {
    id: 7,
    name: "BCAA 200 cápsulas",
    price: 16000,
    image:
      "https://http2.mlstatic.com/D_NQ_NP_671553-MLU74111597489_012024-O.webp",
  },
  {
    id: 8,
    name: "Cinturón de levantamiento",
    price: 14000,
    image:
      "https://mirfitness-media.s3.us-east-2.amazonaws.com/wp-content/uploads/20250808014239/Cinturon-de-levantamiento-para-crossfit-con-abrojo.jpg",
  },
  {
    id: 9,
    name: "Toalla de microfibra",
    price: 3000,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIeW__i5kOUqE_V40b-fDeDCHvXNfAbQbfkg&s",
  },
];

export const instructors = [
  {
    id: 1,
    name: "Jade Summers",
    specialty: "HIIT",
    image:
      "https://as2.ftcdn.net/v2/jpg/01/34/21/43/1000_F_134214362_AgLWd6Sh6UqlBQlY1iUVoox3cbomiIVj.jpg",
  },
  {
    id: 2,
    name: "Marcus Steele",
    specialty: "Powerlifting",
    image:
      "https://c8.alamy.com/comp/JBC6YC/side-pose-of-gym-instructor-lifting-weights-toning-his-biceps-JBC6YC.jpg",
  },
  {
    id: 3,
    name: "Gabrielle Nguyen",
    specialty: "Yoga",
    image:
      "https://media.istockphoto.com/id/1470234996/es/foto/mujer-sentada-en-un-gimnasio-con-su-clase-de-yoga.jpg?s=612x612&w=0&k=20&c=7J5Sw2lr2f1E2QF2z46vJ0wMgaQNGb5bDVz9FLQ1tHI=",
  },
];

export const plans = [
  {
    id: "monthly",
    title: "Membresía Mensual",
    price: "39",
    currency: "USD",
    billingCycle: "mes",
    description:
      "Ideal para flexibilidad. Acceso completo a FitCenter con pago mes a mes.",
    features: [
      "Acceso ilimitado a todas las instalaciones",
      "Clases grupales (limitadas)",
      "Uso de casilleros y duchas",
      "Sin compromiso anual",
    ],
    callToAction: "Pagar Mensual",
    featured: false,
  },
  {
    id: "annual",
    title: "Membresía Anual",
    price: "399",
    currency: "USD",
    billingCycle: "anual",
    description:
      "Nuestro plan más popular. Acceso completo y beneficios extra. ¡Ahorra con el pago anual!",
    features: [
      "Acceso ilimitado a todas las instalaciones",
      "Clases grupales exclusivas (Yoga, Spinning, HIIT)",
      "1 sesión de entrenamiento personal gratuita al mes",
      "Acceso 24/7 (con tarjeta de miembro)",
      "Descuentos en tienda de suplementos y ropa",
      "Uso de casilleros y duchas premium",
    ],
    callToAction: "Pagar Anual",
    featured: true,
  },
];
