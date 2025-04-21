import { languages as LanguagesData } from './../../data/LanguagesSeed';
import { Language } from '../../domain/entity/Language';
import { Role } from '../../domain/entity/Role';
import { Skill } from '../../domain/entity/Skill';
import { SkillCategory } from '../../domain/entity/SkillCategories';
import { User } from '../../domain/entity/User';
import { UserLanguage } from '../../domain/entity/UserLanguage';
import { UserRole } from '../../domain/entity/UserRole';
import { UserSkill } from '../../domain/entity/UserSkill';
import { LanguageRepository } from '../../domain/repositories/LanguageRepository';
import { RoleRepository } from '../../domain/repositories/RoleRepository';
import { SkillCategoryRepository } from '../../domain/repositories/SkillCategoriesRepository';
import { SkillRepository } from '../../domain/repositories/SkillRepository';
import { UserLanguageRepository } from '../../domain/repositories/UserLanguageRepository';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { UserRoleRepository } from '../../domain/repositories/UserRoleRepository';
import { UserSkillRepository } from '../../domain/repositories/UserSkillRepository';
import { PasswordService } from '../../shared/utils/bcrypt';
import { usersData } from '../../data/UsersDataSeed';
import { AppDataSource } from '../../infrastructure/persistence/typeormSource';
export class UserSeederService {
  private passwordService = new PasswordService();
  private defaultPassword = process.env.DEFAULT_PASSWORD || '12345678'; // Default password for all users
  private roles = ['admin', 'student', 'mentor'];
  private categorySkillsData = [
    'Backend Development',
    'Frontend Development',
    'Data Science',
    'DevOps',
    'Cloud Computing',
    'Soft Skills',
  ];

  private languageRepository = new LanguageRepository();
  private roleRepository = new RoleRepository();
  private skillCategoryRepository = new SkillCategoryRepository();
  private skillRepository = new SkillRepository();
  private userLanguageRepository = new UserLanguageRepository();
  private userRepository = new UserRepository();
  private userRoleRepository = new UserRoleRepository();
  private userSkillRepository = new UserSkillRepository();

  private shuffleArray<T>(array: T[]): T[] {
    return array.sort(() => Math.random() - 0.5);
  }

  // Save languages to DB
  private async createLanguages(): Promise<Language[]> {
    const languages = [];
    for (const languageName of LanguagesData) {
      let language = new Language();
      language.languageName = languageName;
      language = await this.languageRepository.save(language);
      languages.push(language);
    }
    return languages;
  }

  private async createRoles(): Promise<Role[]> {
    const roles = [];
    for (const roleName of this.roles) {
      let role = new Role();
      role.roleName = roleName;
      role = await this.roleRepository.save(role);
      roles.push(role);
    }
    return roles;
  }

  private async createSkillCategories(): Promise<SkillCategory[]> {
    const categories = [];
    for (const categoryName of this.categorySkillsData) {
      let category = new SkillCategory();
      category.categoryName = categoryName;
      category = await this.skillCategoryRepository.createCategory(category);
      categories.push(category);
    }
    return categories;
  }

  private async createSkills(categories: SkillCategory[]): Promise<Skill[]> {
    const skills = [];
    const skillNames = {
      'Backend Development': [
        'Arquitectura de Software',
        'Bases de Datos SQL y NoSQL',
        'Django',
        'Ruby on Rails',
        'Microservicios Java',
        'Patrones de Diseño',
        'Optimización de Consultas',
        'Gestión de APIs REST y GraphQL',
        'Manejo de Transacciones',
        'Seguridad y Autenticación',
        'Gestión de Concurrencia',
      ],
      'Frontend Development': [
        'React',
        'Accesibilidad Web (A11Y)',
        'Optimización del Rendimiento',
        'Responsive Design',
        'Arquitectura de Componentes',
        'Gestión del Estado (Redux, Vuex)',
        'Pruebas Unitarias (Jest, Mocha)',
        'Optimización de Carga de Imágenes',
      ],
      'Data Science': [
        'TensorFlow',
        'PyTorch',
        'Pandas',
        'Análisis de datos Python',
        'Limpieza de Datos',
        'Visualización de Datos',
        'Modelado Predictivo',
        'Estadística Avanzada',
        'NumPy',
        'Algoritmos de Machine Learning',
        'Ingeniería de Características',
      ],
      DevOps: [
        'Docker',
        'Kubernetes',
        'CI/CD',
        'Automatización de Infraestructura',
        'Monitoreo y Loggin (Prometheus, ELK Stack)',
        'Orquestación de Contenedores',
        'Gestión de Configuraciones (Ansible, Puppet)',
        'Jenkins',
        'Balanceo de Carga',
        'Gestión de Seguridad en DevOps',
        'Versionado de Código',
      ],
      'Cloud Computing': [
        'AWS',
        'Google Cloud',
        'Computación sin Servidor (Serverless)',
        'Escalabilidad Horizontal y Vertical',
        'Seguridad en la Nube',
        'Planificación de Capacidad',
        'Azure',
        'Arquitecturas Multicloud',
        'Gestión de Almacenamiento en la Nube',
        'Automatización de Infraestructura en la Nube',
      ],
    };

    for (const category of categories) {
      for (const skillName of skillNames[category.categoryName] || []) {
        let skill = new Skill();
        skill.skillName = skillName;
        skill.category = category;
        skill = await this.skillRepository.save(skill);
        skills.push(skill);
      }
    }
    return skills;
  }

  private async createUsers(): Promise<User[]> {
    const users = [];

    for (const userName of usersData) {
      const email = userName.email;
      let user = new User();
      user.firstName = userName.firstName;
      user.lastName = userName.lastName;
      user.email = email;
      user.labelProfile = userName.labelProfile;
      user.location = userName.location;
      user.bio = userName.bio;
      user.passwordHash = await this.passwordService.hashPassword(
        this.defaultPassword,
      );
      user = await this.userRepository.save(user);
      users.push(user);
    }
    return users;
  }

  private async assignRolesToUsers(
    users: User[],
    roles: Role[],
  ): Promise<void> {
    const roleMap = new Map<string, Role>();
    roles.forEach((role) => roleMap.set(role.roleName, role));

    const adminRole = roleMap.get('admin');
    const studentRole = roleMap.get('student');
    const mentorRole = roleMap.get('mentor');

    if (!adminRole || !studentRole || !mentorRole) {
      throw new Error('Roles "admin", "student", or "mentor" not found');
    }

    const roleAssignments: UserRole[] = [];

    users.forEach((user, index) => {
      if (index === 0) {
        // Asignar todos los roles (admin, student, mentor) al primer usuario
        roleAssignments.push(
          ...[adminRole, studentRole, mentorRole].map((role) => {
            const userRole = new UserRole();
            userRole.user = user;
            userRole.role = role;
            return userRole;
          }),
        );
      } else {
        // Asignar solo los roles de 'student' y 'mentor' al resto de los usuarios
        roleAssignments.push(
          ...[studentRole, mentorRole].map((role) => {
            const userRole = new UserRole();
            userRole.user = user;
            userRole.role = role;
            return userRole;
          }),
        );
      }
    });

    // Guardar todos los roles asignados de una vez
    for (const userRole of roleAssignments) {
      await this.userRoleRepository.save(userRole);
    }
  }

  private async assignLanguagesToUsers(
    users: User[],
    languages: Language[],
  ): Promise<void> {
    for (const user of users) {
      // Selecciona aleatoriamente hasta 5 lenguajes
      const assignedLanguages = this.shuffleArray(languages).slice(0, 5);

      const userLanguages: UserLanguage[] = assignedLanguages.map(
        (language) => {
          const userLanguage = new UserLanguage();
          userLanguage.user = user;
          userLanguage.language = language;
          userLanguage.yearsOfExperience = Math.floor(Math.random() * 5) + 2;
          userLanguage.proficiencyLevel = Math.floor(
            Math.random() * 101,
          ).toString(); // Convertir a string
          return userLanguage;
        },
      );

      // Guarda las asignaciones de lenguajes para el usuario
      for (const userLanguage of userLanguages) {
        await this.userLanguageRepository.save(userLanguage);
      }
    }
  }

  private async assignSkillsToUsers(
    users: User[],
    skills: Skill[],
  ): Promise<void> {
    for (const user of users) {
      // Selecciona aleatoriamente hasta 6 habilidades
      const assignedSkills = this.shuffleArray(skills).slice(0, 6);

      const userSkills: UserSkill[] = assignedSkills.map((skill) => {
        const userSkill = new UserSkill();
        userSkill.user = user;
        userSkill.skill = skill;
        userSkill.yearsOfExperience = Math.floor(Math.random() * 6) + 2;
        userSkill.description =
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
        return userSkill;
      });

      // Guarda las asignaciones de habilidades para el usuario
      for (const userSkill of userSkills) {
        await this.userSkillRepository.save(userSkill);
      }
    }
  }

  // Función para truncar tablas
  private async truncateTables(): Promise<void> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      await queryRunner.query(`
          TRUNCATE TABLE 
            "Roles", 
            "Languages", 
            "UserSkills", 
            "Skills", 
            "SkillCategories", 
            "FriendRequests",
            "ChatParticipants",
            "Messages",
            "Chats",
            "Meetings",
            "UserProfessionalStudies",
            "UserRoles",
            "Users",
            "UserLanguages"
          RESTART IDENTITY CASCADE;
        `);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(`Error truncating tables: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  public async seed() {
    // delete all
    await this.truncateTables();

    const roles = await this.createRoles();
    const languages = await this.createLanguages();
    const categories = await this.createSkillCategories();
    const skills = await this.createSkills(categories);
    const users = await this.createUsers();

    await this.assignRolesToUsers(users, roles);
    await this.assignLanguagesToUsers(users, languages);
    await this.assignSkillsToUsers(users, skills);
  }
}
