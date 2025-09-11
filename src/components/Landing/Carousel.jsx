import { useState, useEffect } from "react";
import { Box, Button, HStack, VStack } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

export default function Carousel({ items, renderItem }) {
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

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  // Productos visibles, con slice circular
  const visibleItems = [];
  for (let i = 0; i < visibleCount; i++) {
    visibleItems.push(items[(currentIndex + i) % items.length]);
  }

  return (
    <VStack spacing={4} align="center" width="100%">
      <HStack spacing={4} width="100%" justify="center">
        <Button onClick={handlePrev}>
          <ChevronLeftIcon boxSize={6} />
        </Button>

        <HStack width="100%" overflow="hidden" justify="flex-start" spacing={0}>
          {visibleItems.map((item, i) => (
            <Box
              key={i}
              flex="0 0 auto"
              width={`${100 / visibleCount}%`}
              px={2}
            >
              {renderItem(item)}
            </Box>
          ))}
        </HStack>

        <Button onClick={handleNext}>
          <ChevronRightIcon boxSize={6} />
        </Button>
      </HStack>
    </VStack>
  );
}
