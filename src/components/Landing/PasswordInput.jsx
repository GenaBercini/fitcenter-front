import {
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  FormErrorMessage,
  Text,
  HStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const PasswordInput = ({ field, errors, handleChange, values }) => {
  const [show, setShow] = useState(false);
  return (
    <FormControl isInvalid={errors[field]}>
      <HStack align="center">
        <InputGroup size="md">
          <Input
            placeholder="Contraseña"
            type={show ? "text" : "password"}
            value={values[field]}
            onChange={(e) => handleChange(field, e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
              {show ? <FaRegEyeSlash /> : <FaRegEye />}
            </Button>
          </InputRightElement>
        </InputGroup>
          <Text color="red.500" fontWeight="bold" fontSize="lg">
            *
          </Text>
      </HStack>
      <FormErrorMessage>{errors[field]}</FormErrorMessage>
    </FormControl>
  );
};
export default PasswordInput;
