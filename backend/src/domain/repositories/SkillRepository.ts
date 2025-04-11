import { AppDataSource } from '../../infrastructure/persistence/typeormSource';
import { Skill } from '../entity/Skill';

export class SkillRepository {
  private skillRepository = AppDataSource.getRepository(Skill);

  // Método para guardar un skill (Crear o Actualizar)
  async save(skill: Skill): Promise<Skill> {
    return await this.skillRepository.save(skill);
  }

  async findAllList(): Promise<Skill[]> {
    return await this.skillRepository.find();
  }

  // Método para obtener todos los skills con paginación y relación a SkillCategory
  async findAll(
    page: number = 1,
    perPage: number = 10,
  ): Promise<{ data: Skill[]; total: number }> {
    const take = perPage;
    const skip = (page - 1) * take;

    const [skills, total] = await this.skillRepository.findAndCount({
      relations: ['category'], // Incluir la relación con SkillCategory (nombre correcto)
      order: { id: 'ASC' }, // Ordenar por ID ascendente
      skip,
      take,
    });

    return { data: skills, total };
  }

  // Método para buscar un skill por ID con su relación con SkillCategory
  async findById(id: number): Promise<Skill | undefined> {
    return await this.skillRepository
      .createQueryBuilder('skill')
      .innerJoinAndSelect('skill.category', 'category') // Cambiar a 'skill.category' en lugar de 'skill.skillCategory'
      .where('skill.id = :id', { id }) // Condición para el ID
      .getOne(); // Obtener un solo resultado
  }

  // Método para actualizar un skill
  async update(
    id: number,
    updatedSkill: Partial<Skill>,
  ): Promise<Skill | undefined> {
    await this.skillRepository.update(id, updatedSkill);
    return this.findById(id);
  }

  // Método para eliminar un skill
  async delete(id: number): Promise<void> {
    await this.skillRepository.delete(id);
  }
}
