import React from 'react';
import Input from './Input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

const InputWithIcon: React.FC = () => {
  return (
    <Input
      type="email"
      name="email"
      placeholder="Ingresa tu email"
      label="Email"
      icon={<FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />}
    />
  );
};

export default InputWithIcon;
