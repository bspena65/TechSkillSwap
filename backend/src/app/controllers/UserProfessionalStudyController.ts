import { Request, Response } from 'express';
import { UserProfessionalStudyRepository } from '../../domain/repositories/UserProfessionalStudyRepository';

const studyRepository = new UserProfessionalStudyRepository();

export class UserProfessionalStudyController {
  // Crear un nuevo estudio profesional
  static async create(req: Request, res: Response) {
    const studyData = req.body;
    try {
      const study = await studyRepository.createStudy(studyData);
      return res.status(201).json(study);
    } catch (error) {
      return res.status(500).json({
        message: 'Error al crear el estudio profesional',
        error,
      });
    }
  }

  // Obtener todos los estudios profesionales con paginación
  static async findAll(req: Request, res: Response) {
    const page = parseInt(req.query.page as string, 10) || 1;
    const perPage = parseInt(req.query.perPage as string, 10) || 10;

    try {
      const { data: studies, total } = await studyRepository.findAllStudies(
        page,
        perPage,
      );
      return res.status(200).json({
        data: studies,
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Error al listar los estudios profesionales',
        error,
      });
    }
  }

  // Obtener un estudio profesional por ID
  static async findById(req: Request, res: Response) {
    const study_id = parseInt(req.params.study_id, 10);

    try {
      const study = await studyRepository.findStudyById(study_id);
      if (!study) {
        return res
          .status(404)
          .json({ message: 'Estudio profesional no encontrado' });
      }
      return res.status(200).json(study);
    } catch (error) {
      return res.status(500).json({
        message: 'Error al obtener el estudio profesional',
        error,
      });
    }
  }

  // Actualizar un estudio profesional por ID
  static async update(req: Request, res: Response) {
    const study_id = parseInt(req.params.study_id, 10);
    const updatedStudyData = req.body;

    try {
      const updatedStudy = await studyRepository.updateStudy(
        study_id,
        updatedStudyData,
      );
      if (!updatedStudy) {
        return res
          .status(404)
          .json({ message: 'Estudio profesional no encontrado' });
      }
      return res.status(200).json(updatedStudy);
    } catch (error) {
      return res.status(500).json({
        message: 'Error al actualizar el estudio profesional',
        error,
      });
    }
  }

  // Eliminar un estudio profesional por ID
  static async delete(req: Request, res: Response) {
    const study_id = parseInt(req.params.study_id, 10);

    try {
      await studyRepository.deleteStudy(study_id);
      return res
        .status(200)
        .json({ message: 'Estudio profesional eliminado con éxito' });
    } catch (error) {
      return res.status(500).json({
        message: 'Error al eliminar el estudio profesional',
        error,
      });
    }
  }
}
