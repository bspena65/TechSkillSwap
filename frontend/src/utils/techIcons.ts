import ReactIcon from "/techicons/react.svg";
import PhpIcon from "/techicons/php.svg";
import CppIcon from "/techicons/c++.svg";
import DefaultIcon from "/techicons/react.svg";

export const techIcons: { [key: string]: string } = {
  react: ReactIcon,
  python: ReactIcon,
  php: PhpIcon,
  cpp: CppIcon,
  default: DefaultIcon,
};

// Convierte todas las keys a minúsculas
export const getTechIcon = (name: string): string => {
  const iconKey = name.toLowerCase();
  return techIcons[iconKey] || techIcons["default"];
};
