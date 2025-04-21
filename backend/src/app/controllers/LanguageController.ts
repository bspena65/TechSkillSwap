import { Request, Response } from 'express';
import { LanguageRepository } from '../../domain/repositories/LanguageRepository';
import { Language } from '../../domain/entity/Language';

const languageRepository = new LanguageRepository();
export class LanguageController {

  static async findAllList(req: Request, res: Response) {
    try {
      const languages = await languageRepository.findAllList();
      return res.status(200).json(languages);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error al listar los lenguajes', error });
    }
  }
  
  // Crear un nuevo language
  static async create(req: Request, res: Response) {
    const { languageName } = req.body;
    const newLanguage = new Language();
    newLanguage.languageName = languageName;

    try {
      const savedLanguage = await languageRepository.save(newLanguage);
      return res.status(201).json(savedLanguage);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error al crear el lenguaje', error });
    }
  }

  // Obtener todos los lenguajes, con paginación opcional
  static async findAll(req: Request, res: Response) {
    const page = req.params.page ? parseInt(req.params.page, 10) : null; // Página opcional
    const perPage = req.query.perPage
      ? parseInt(req.query.perPage as string, 10)
      : 50; // Default a 50 por página si no se especifica

    try {
      const { data: languages, total } = await languageRepository.findAll(
        page,
        perPage,
      );

      const format = {
        data: languages,
        page: page || 1,
        perPage: perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      };

      return res.status(200).json(format);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error al listar los lenguajes', error });
    }
  }

  // Obtener un language por ID
  static async getById(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);

    try {
      const language = await languageRepository.findById(id);
      if (!language) {
        return res.status(404).json({ message: 'Lenguaje no encontrado' });
      }
      return res.status(200).json(language);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error al obtener el lenguaje', error });
    }
  }

  // Actualizar un language
  static async update(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);
    const { languageName } = req.body;

    try {
      const updatedLanguage = await languageRepository.update(id, {
        languageName,
      });
      if (!updatedLanguage) {
        return res.status(404).json({ message: 'Lenguaje no encontrado' });
      }
      return res.status(200).json(updatedLanguage);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error al actualizar el lenguaje', error });
    }
  }

  // Eliminar un language
  static async delete(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);

    try {
      await languageRepository.delete(id);
      return res.status(200).json({ message: 'Lenguaje eliminado con éxito' });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error al eliminar el lenguaje', error });
    }
  }

  // Búsqueda general
  static async search(req: Request, res: Response) {
    const { name } = req.query;

    try {
      const language = await languageRepository.findByName(name as string);
      if (!language) {
        return res.status(404).json({ message: 'Lenguaje no encontrado' });
      }
      return res.status(200).json(language);
    } catch (error) {
      return res.status(500).json({ message: 'Error en la búsqueda', error });
    }
  }
}
