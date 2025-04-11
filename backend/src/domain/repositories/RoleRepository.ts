import { In } from 'typeorm';
import { AppDataSource } from '../../infrastructure/persistence/typeormSource';
import { Role } from '../entity/Role';

export class RoleRepository {
  private roleRepository = AppDataSource.getRepository(Role);

  // Método para guardar un role (Crear o Actualizar)
  async save(role: Role): Promise<Role> {
    return await this.roleRepository.save(role);
  }

  // Método para obtener todos los roles
  async findAll(): Promise<Role[]> {
    return await this.roleRepository.find();
  }

  // Método para buscar roles por un array de nombres
  async findByNames(names: string[]): Promise<Role[]> {
    return await this.roleRepository.find({
      where: {
        roleName: In(names), // Usamos el operador IN para encontrar coincidencias
      },
    });
  }

  // Método para buscar un role por ID (Leer)
  async findById(id: number): Promise<Role | undefined> {
    return await this.roleRepository.findOne({ where: { id } });
  }

  // Método para actualizar un role
  async update(
    id: number,
    updatedRole: Partial<Role>,
  ): Promise<Role | undefined> {
    await this.roleRepository.update(id, updatedRole);
    return this.findById(id);
  }

  // Método para eliminar un role
  async delete(id: number): Promise<void> {
    await this.roleRepository.delete(id);
  }
}
