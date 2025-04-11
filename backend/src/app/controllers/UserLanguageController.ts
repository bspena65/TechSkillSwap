import { Request, Response } from 'express';
import { UserLanguageRepository } from '../../domain/repositories/UserLanguageRepository';

const userLanguageRepository = new UserLanguageRepository();

export class UserLanguageController {
  // Crear o actualizar un userLanguage
  static async save(req: Request, res: Response) {
    const userLanguageData = req.body;
    try {
      const userLanguage = await userLanguageRepository.save(userLanguageData);
      return res.status(201).json(userLanguage);
    } catch (error) {
      return res.status(500).json({
        message: 'Error al guardar el idioma del usuario',
        error,
      });
    }
  }

  // Listar todos los userLanguages con paginación
  static async findAll(req: Request, res: Response) {
    const page = parseInt(req.query.page as string, 10) || 1;
    const perPage = parseInt(req.query.perPage as string, 10) || 10;

    try {
      const { data: userLanguages, total } =
        await userLanguageRepository.findAll(page, perPage);
      return res.status(200).json({
        data: userLanguages,
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Error al listar los idiomas del usuario',
        error,
      });
    }
  }

  // Obtener un userLanguage por ID
  static async findById(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);

    try {
      const userLanguage = await userLanguageRepository.findById(id);
      if (!userLanguage) {
        return res
          .status(404)
          .json({ message: 'Idioma del usuario no encontrado' });
      }
      return res.status(200).json(userLanguage);
    } catch (error) {
      return res.status(500).json({
        message: 'Error al obtener el idioma del usuario',
        error,
      });
    }
  }

  // Actualizar un userLanguage por ID
  static async update(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);
    const updatedUserLanguageData = req.body;

    try {
      const updatedUserLanguage = await userLanguageRepository.update(
        id,
        updatedUserLanguageData,
      );
      if (!updatedUserLanguage) {
        return res
          .status(404)
          .json({ message: 'Idioma del usuario no encontrado' });
      }
      return res.status(200).json(updatedUserLanguage);
    } catch (error) {
      return res.status(500).json({
        message: 'Error al actualizar el idioma del usuario',
        error,
      });
    }
  }

  // Eliminar un userLanguage por ID
  static async delete(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);

    try {
      await userLanguageRepository.delete(id);
      return res
        .status(200)
        .json({ message: 'Idioma del usuario eliminado con éxito' });
    } catch (error) {
      return res.status(500).json({
        message: 'Error al eliminar el idioma del usuario',
        error,
      });
    }
  }
}
