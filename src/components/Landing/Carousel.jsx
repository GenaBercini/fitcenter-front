import { useState, useEffect } from "react";
import { Box, Button, HStack, VStack } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

export default function Carousel({ items = [], renderItem }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);

  // Detecta cuántos productos entran en pantalla según el ancho
  useEffect(() => {
    const updateVisibleCount = () => {
      const width = window.innerWidth;
      if (width < 640) setVisibleCount(1);
      else if (width < 1024) setVisibleCount(2);
      else if (width < 1400) setVisibleCount(3);
      else if (width < 1800) setVisibleCount(5);
      else setVisibleCount(6);
    };
    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  // Resetea el índice si la lista filtrada cambia de tamaño
  useEffect(() => {
    setCurrentIndex(0);
  }, [items.length]);

  if (!items || items.length === 0) return null;

  // Si la cantidad de items es menor o igual al espacio visible en pantalla, no aplicamos loop
  const isSmallList = items.length <= visibleCount;

  const handleNext = () => {
    if (isSmallList) return;
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    if (isSmallList) return;
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  // Generamos la lista de items a mostrar sin duplicar si no hay suficientes
  const visibleItems = isSmallList
    ? items
    : Array.from(
        { length: visibleCount },
        (_, i) => items[(currentIndex + i) % items.length],
      );

  return (
    <VStack spacing={4} align="center" width="100%">
      <HStack spacing={4} width="100%" justify="center">
        {/* Oculta el botón anterior si entran todos los items en pantalla */}
        {!isSmallList && (
          <Button onClick={handlePrev} variant="ghost" rounded="full">
            <ChevronLeftIcon boxSize={6} />
          </Button>
        )}

        <HStack
          width="100%"
          overflow="hidden"
          justify={isSmallList ? "center" : "flex-start"}
          spacing={0}
        >
          {visibleItems.map((item, i) => (
            <Box
              key={item.id || i}
              flex="0 0 auto"
              width={
                isSmallList
                  ? `${100 / items.length}%`
                  : `${100 / visibleCount}%`
              }
              maxW={`${100 / visibleCount}%`}
              px={2}
            >
              {renderItem(item)}
            </Box>
          ))}
        </HStack>

        {/* Oculta el botón siguiente si entran todos los items en pantalla */}
        {!isSmallList && (
          <Button onClick={handleNext} variant="ghost" rounded="full">
            <ChevronRightIcon boxSize={6} />
          </Button>
        )}
      </HStack>
    </VStack>
  );
}
