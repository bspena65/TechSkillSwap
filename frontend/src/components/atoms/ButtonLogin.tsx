import React from 'react';
import Button from './Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';

const ButtonLogin: React.FC = () => {
  return (
    <Button
      label="Iniciar Sesión"
      variant="primary"
      to="/auth/login"
      icon={<FontAwesomeIcon icon={faSignInAlt} />}
    />
  );
};

export default ButtonLogin;
