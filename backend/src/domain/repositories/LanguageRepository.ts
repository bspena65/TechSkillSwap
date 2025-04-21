import { AppDataSource } from '../../infrastructure/persistence/typeormSource';
import { Language } from '../entity/Language';

export class LanguageRepository {
  private languageRepository = AppDataSource.getRepository(Language);

  async findAllList(): Promise<Language[]> {
    return await this.languageRepository.find();
  }
  
  // Método para guardar un language (Crear o Actualizar)
  async save(language: Language): Promise<Language> {
    return await this.languageRepository.save(language);
  }

  // Método para obtener todos los languages con paginación o sin paginación
  async findAll(
    page?: number,
    perPage?: number,
  ): Promise<{ data: Language[]; total: number }> {
    const take = perPage || 0; // Si no se especifica perPage, se obtendrán todos
    const skip = page ? (page - 1) * take : 0; // Si no se especifica página, no se salta ningún registro

    // Si page no está definido, no hacemos paginación (retornamos todos)
    const [languages, total] = await this.languageRepository.findAndCount({
      skip: page ? skip : undefined, // Solo se hace skip si se especifica page
      take: page ? take : undefined, // Solo se limita el número de resultados si se especifica perPage
      order: {
        id: 'ASC', // Ordenar por ID ascendente
      },
    });

    return { data: languages, total };
  }

  // Método para buscar un language por nombre
  async findByName(name: string): Promise<Language | undefined> {
    return await this.languageRepository.findOne({
      where: { languageName: name },
    });
  }

  // Método para buscar un language por ID (Leer)
  async findById(id: number): Promise<Language | undefined> {
    return await this.languageRepository.findOne({ where: { id } });
  }

  // Método para actualizar un language
  async update(
    id: number,
    updatedLanguage: Partial<Language>,
  ): Promise<Language | undefined> {
    await this.languageRepository.update(id, updatedLanguage);
    return this.findById(id);
  }

  // Método para eliminar un language
  async delete(id: number): Promise<void> {
    await this.languageRepository.delete(id);
  }
}
