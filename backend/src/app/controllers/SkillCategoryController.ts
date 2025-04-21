import { Request, Response } from 'express';
import { SkillCategoryRepository } from '../../domain/repositories/SkillCategoriesRepository';

const skillCategoryRepository = new SkillCategoryRepository();

export class SkillCategoryController {
  // Crear una nueva categoría de habilidades
  static async create(req: Request, res: Response) {
    const categoryData = req.body;
    try {
      const category =
        await skillCategoryRepository.createCategory(categoryData);
      return res.status(201).json(category);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error al crear la categoría de habilidades', error });
    }
  }

  // Listar todas las categorías de habilidades con paginación
  static async findAll(req: Request, res: Response) {
    const page = parseInt(req.query.page as string, 10) || 1;
    const perPage = parseInt(req.query.perPage as string, 10) || 10;

    try {
      const { data: categories, total } =
        await skillCategoryRepository.findAllCategories(page, perPage);
      return res.status(200).json({
        data: categories,
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      });
    } catch (error) {
      return res
        .status(500)
        .json({
          message: 'Error al listar las categorías de habilidades',
          error,
        });
    }
  }

  // Obtener una categoría de habilidades por ID
  static async findById(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);

    try {
      const category = await skillCategoryRepository.findCategoryById(id);
      if (!category) {
        return res
          .status(404)
          .json({ message: 'Categoría de habilidades no encontrada' });
      }
      return res.status(200).json(category);
    } catch (error) {
      return res
        .status(500)
        .json({
          message: 'Error al obtener la categoría de habilidades',
          error,
        });
    }
  }

  // Actualizar una categoría de habilidades por ID
  static async update(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);
    const updatedCategoryData = req.body;

    try {
      const updatedCategory = await skillCategoryRepository.updateCategory(
        id,
        updatedCategoryData,
      );
      if (!updatedCategory) {
        return res
          .status(404)
          .json({ message: 'Categoría de habilidades no encontrada' });
      }
      return res.status(200).json(updatedCategory);
    } catch (error) {
      return res
        .status(500)
        .json({
          message: 'Error al actualizar la categoría de habilidades',
          error,
        });
    }
  }

  // Eliminar una categoría de habilidades por ID
  static async delete(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);

    try {
      await skillCategoryRepository.deleteCategory(id);
      return res
        .status(200)
        .json({ message: 'Categoría de habilidades eliminada con éxito' });
    } catch (error) {
      return res
        .status(500)
        .json({
          message: 'Error al eliminar la categoría de habilidades',
          error,
        });
    }
  }
}
