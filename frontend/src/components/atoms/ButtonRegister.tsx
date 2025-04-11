import React from 'react';
import Button from './Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';


const ButtonRegister: React.FC = () => {
  return (
    <Button
      label="Crear Cuenta"
      variant="primary"
      to="/auth/register"
      icon={<FontAwesomeIcon icon={faSignInAlt} />}
    />
  );
};

export default ButtonRegister;
