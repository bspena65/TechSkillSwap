import { AppDataSource } from '../../infrastructure/persistence/typeormSource';
import { UserProfessionalStudy } from '../entity/UserProfessionalStudy';

export class UserProfessionalStudyRepository {
  private studyRepository = AppDataSource.getRepository(UserProfessionalStudy);

  // Crear un nuevo estudio profesional
  async createStudy(
    studyData: Partial<UserProfessionalStudy>,
  ): Promise<UserProfessionalStudy> {
    const study = this.studyRepository.create(studyData);
    return await this.studyRepository.save(study);
  }

  // Obtener todos los estudios profesionales con paginación
  async findAllStudies(
    page: number = 1,
    perPage: number = 10,
  ): Promise<{ data: UserProfessionalStudy[]; total: number }> {
    const take = perPage;
    const skip = (page - 1) * take;

    const [studies, total] = await this.studyRepository.findAndCount({
      relations: ['user'],
      skip,
      take,
    });

    return { data: studies, total };
  }

  // Obtener un estudio profesional por ID
  async findStudyById(
    study_id: number,
  ): Promise<UserProfessionalStudy | undefined> {
    return await this.studyRepository.findOne({
      where: { study_id },
      relations: ['user'],
    });
  }

  // Actualizar un estudio profesional por ID
  async updateStudy(
    study_id: number,
    updatedStudyData: Partial<UserProfessionalStudy>,
  ): Promise<UserProfessionalStudy | undefined> {
    await this.studyRepository.update(study_id, updatedStudyData);
    return this.findStudyById(study_id);
  }

  // Eliminar un estudio profesional por ID
  async deleteStudy(study_id: number): Promise<void> {
    await this.studyRepository.delete(study_id);
  }
}
