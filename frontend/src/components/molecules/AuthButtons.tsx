import React from 'react';
import ButtonLogin from '../atoms/ButtonLogin';
import ButtonRegister from '../atoms/ButtonRegister';

const AuthButtons: React.FC = () => {
  return (
    <div className="flex space-x-4 md:space-x-0 md:flex-row gap-2 flex-col">
      <ButtonLogin />
      <ButtonRegister />
    </div>
  );
};

export default AuthButtons;
