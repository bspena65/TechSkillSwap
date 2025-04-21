import { AppDataSource } from '../../infrastructure/persistence/typeormSource';
import { UserRole } from '../entity/UserRole';

export class UserRoleRepository {
  private userRoleRepository = AppDataSource.getRepository(UserRole);

  // Método para guardar un userRole (Crear o Actualizar)
  async save(userRole: UserRole): Promise<UserRole> {
    return await this.userRoleRepository.save(userRole);
  }

  // Método para obtener todos los userRoles
  async findAll(): Promise<UserRole[]> {
    return await this.userRoleRepository.find();
  }

}
