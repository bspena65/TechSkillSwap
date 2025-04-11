import React from 'react';
import Button from './Button';

const ButtonGithub: React.FC = () => {
  return (
    <Button
      label="Github"
      variant="primary"
      to="/auth/github"
      icon={<svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 2C6.75 2 2 6.75 2 12c0 5.25 4.75 10 10 10 4.25 0 7.75-2.5 9.25-6.25a.75.75 0 00-1.5-.25c-1.25 3.75-4.25 6.25-7.75 6.25-4.75 0-8.5-3.75-8.5-8.5S7.25 3.5 12 3.5c2.75 0 5.25 1.25 6.75 3.25a.75.75 0 001-1.125C17.75 4.25 15 2 12 2z"
        />
      </svg>}
    />
  );
};

export default ButtonGithub;
