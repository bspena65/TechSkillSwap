import React from "react";
import PasswordInput from "./PasswordInput";

const PasswordInputField: React.FC = () => {
  return (
    <PasswordInput
      name="password"
      placeholder="+8 caracteres"
      label="Contraseña"
    />
  );
};

export default PasswordInputField;
