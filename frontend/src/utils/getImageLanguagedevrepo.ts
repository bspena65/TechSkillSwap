  export const getImageLanguagedevrepo = (language: string) => {
    const toLower = language.toLowerCase();
    if (language === "C#") {
      return `https://raw.githubusercontent.com/devicons/devicon/master/icons/csharp/csharp-original.svg`;
    } else if (language === "C++") {
      return `https://raw.githubusercontent.com/devicons/devicon/master/icons/cplusplus/cplusplus-original.svg`;
    } else if (language === "Objective-C") {
      return `https://raw.githubusercontent.com/devicons/devicon/master/icons/objectivec/objectivec-original.svg`;
    }
    return `https://raw.githubusercontent.com/devicons/devicon/master/icons/${toLower}/${toLower}-original.svg`;
  };