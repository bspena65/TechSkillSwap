import React from 'react';
import Logo from '../molecules/Logo';
import AuthButtons from '../molecules/AuthButtons';

const HeaderHome: React.FC = () => {
  return (
    <header className="flex justify-between items-center px-4 md:px-6 lg:px-[85px] py-4 h-auto bg-darkx">
      <Logo />
      <div className=" md:flex flex-col md:flex-row md:space-x-4">
        <AuthButtons />
      </div>
    </header>
  );
};

export default HeaderHome;
