import { AppDataSource } from '../../infrastructure/persistence/typeormSource';
import { UserSkill } from '../entity/UserSkill';

export class UserSkillRepository {
  private userSkillRepository = AppDataSource.getRepository(UserSkill);

  // Método para guardar un userSkill (Crear o Actualizar)
  async save(userSkill: UserSkill): Promise<UserSkill> {
    return await this.userSkillRepository.save(userSkill);
  }

  // get User Skills by user id
  async findByUserId(userId: number): Promise<UserSkill[]> {
    return await this.userSkillRepository.find({
      where: { user: { id: userId } },
      relations: ['skill'],
    });
  }

  // Método para obtener todos los userSkills con paginación
  async findAll(
    page: number = 1,
    perPage: number = 10,
  ): Promise<{ data: UserSkill[]; total: number }> {
    const take = perPage;
    const skip = (page - 1) * take;

    const [skills, total] = await this.userSkillRepository.findAndCount({
      relations: ['user', 'skill'],
      skip,
      take,
      order: { id: 'ASC' }, // Orden por ID ascendente
    });

    return { data: skills, total };
  }

  // Método para buscar un userSkill por ID (Leer)
  async findById(id: number): Promise<UserSkill | undefined> {
    return await this.userSkillRepository.findOne({
      where: { id },
      relations: ['user', 'skill'],
    });
  }

  // Método para actualizar un userSkill
  async update(
    id: number,
    updatedUserSkill: Partial<UserSkill>,
  ): Promise<UserSkill | undefined> {
    await this.userSkillRepository.update(id, updatedUserSkill);
    return this.findById(id);
  }

  // Método para eliminar un userSkill
  async delete(id: number): Promise<void> {
    await this.userSkillRepository.delete(id);
  }
}
