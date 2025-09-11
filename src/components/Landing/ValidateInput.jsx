import { FormControl, Input, FormErrorMessage, Text, HStack } from "@chakra-ui/react";

const ValidatedInput = ({
  values,
  errors,
  field,
  placeholder,
  type,
  inputProps = {},
  handleChange
}) => (
  <FormControl isInvalid={errors[field]} isRequired>
    <HStack align="center">
        <Input
          type={type}
          placeholder={placeholder}
          value={values[field]}
          onChange={(e) => handleChange(field, e.target.value)}
          {...inputProps}
        />
        {(type === "email" || type === "password" || type === "nroMatricula") && (
          <Text color="red.500" fontWeight="bold" fontSize="lg">
            *
          </Text>
        )}
      </HStack>
    <FormErrorMessage>{errors[field]}</FormErrorMessage>
  </FormControl>
);

export default ValidatedInput;