// Define interfaces for user data
export interface UserRole {
  id: number;
  role: {
    id: number;
    roleName: string;
  };
}

export interface UserSkill {
  id: number;
  proficiencyLevel: string;
  yearsOfExperience: number;
  description: string | null;
  skill: {
    id: number;
    skillName: string;
  };
}

export interface UserLanguage {
  id: number;
  proficiencyLevel: string;
  yearsOfExperience: number;
  language: {
    id: number;
    languageName: string;
  };
}

export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  bio: string | null;
  userRoles: UserRole[];
  userLanguages: UserLanguage[];
  userSkills: UserSkill[];
  userProfessionalStudies: Array<any>;
}