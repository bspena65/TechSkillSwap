export interface User {
  id?: number;
  first_name?: string;
  last_name?: string;
  firstName?: string;
  lastName?: string;
  location?: string;
  labelProfile?: string;
  email?: string;
  passwordHash?: string;
  profilePictureUrl?: string | null;
  bio?: string;
  authProvider?: string;
  authProviderId?: string;
  userRoles?: UserRole[];
  userLanguages?: UserLanguage[];
  userSkills?: UserSkill[];
  userProfessionalStudies?: UserProfessionalStudy[];
}

export interface UserResponse extends Omit<User, "passwordHash"> {}

export interface UserLanguage {
  id?: number;
  proficiencyLevel?: string;
  yearsOfExperience?: number;
  language?: Language;
}

export interface Language {
  id?: number;
  languageName?: string;
}

export interface Skill {
  id?: number;
  skillName?: string;
}

export interface UserProfessionalStudy {
  study_id?: number;
  degree?: string;
  institution?: string;
  start_date?: Date | string;
  end_date?: Date | string;
  description?: string;
  level_study?: string;
  state?: string;
}

export interface UserRole {
  id?: number;
  role?: Role;
}

export interface Role {
  id?: number;
  roleName?: string;
}

export interface UserSkill {
  id?: number;
  description?: string;
  yearsOfExperience?: number;
  skill?: Skill;
}

export interface Skill {
  id?: number;
  skillName?: string;
}
