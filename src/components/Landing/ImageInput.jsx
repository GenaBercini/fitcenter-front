import React, { useRef } from "react";
import { Button, Image, HStack, Text, Avatar } from "@chakra-ui/react";
import { IoIosAddCircleOutline } from "react-icons/io";

const ImageInput = ({ handleSetImage, previewUrl }) => {
  const inputRef = useRef(null);

  const handleClick = () => {
    inputRef.current.click();
  };

  return (
    <HStack alignItems="center" justifyContent="space-between">
        <Avatar size="xl" src={previewUrl} alt="Preview" />
      <Button
        leftIcon={<IoIosAddCircleOutline />}
        colorScheme="blue"
        variant="solid"
        onClick={handleClick}
        rounded="3xl"
      >
        Subir Imagen
      </Button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleSetImage}
      />
    </HStack>
  );
};

export default ImageInput;
