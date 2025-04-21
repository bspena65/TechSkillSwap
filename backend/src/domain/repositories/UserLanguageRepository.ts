import { AppDataSource } from '../../infrastructure/persistence/typeormSource';
import { UserLanguage } from '../entity/UserLanguage';

export class UserLanguageRepository {
  private userLanguageRepository = AppDataSource.getRepository(UserLanguage);

  // Método para guardar un userLanguage (Crear o Actualizar)
  async save(userLanguage: UserLanguage): Promise<UserLanguage> {
    return await this.userLanguageRepository.save(userLanguage);
  }

  // Método para obtener todos los userLanguages con paginación
  async findAll(
    page: number = 1,
    perPage: number = 10,
  ): Promise<{ data: UserLanguage[]; total: number }> {
    const take = perPage;
    const skip = (page - 1) * take;

    const [languages, total] = await this.userLanguageRepository.findAndCount({
      relations: ['user', 'language'],
      skip,
      take,
      order: { id: 'ASC' }, // Orden por ID ascendente
    });

    return { data: languages, total };
  }

  // Método para buscar un userLanguage por ID (Leer)
  async findById(id: number): Promise<UserLanguage | undefined> {
    return await this.userLanguageRepository.findOne({
      where: { id },
      relations: ['user', 'language'],
    });
  }

  // Método para actualizar un userLanguage
  async update(
    id: number,
    updatedUserLanguage: Partial<UserLanguage>,
  ): Promise<UserLanguage | undefined> {
    await this.userLanguageRepository.update(id, updatedUserLanguage);
    return this.findById(id);
  }

  // Método para eliminar un userLanguage
  async delete(id: number): Promise<void> {
    await this.userLanguageRepository.delete(id);
  }
}
