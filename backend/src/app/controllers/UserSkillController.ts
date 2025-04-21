import { Request, Response } from 'express';
import { UserSkillRepository } from '../../domain/repositories/UserSkillRepository';

const userSkillRepository = new UserSkillRepository();

export class UserSkillController {
  // Crear o actualizar un userSkill
  static async save(req: Request, res: Response) {
    const userSkillData = req.body;
    try {
      const userSkill = await userSkillRepository.save(userSkillData);
      return res.status(201).json(userSkill);
    } catch (error) {
      return res.status(500).json({
        message: 'Error al guardar la habilidad del usuario',
        error,
      });
    }
  }

  // Obtener las habilidades de un usuario por ID
  static async findByUserId(req: Request, res: Response) {
    const userId = parseInt(req.params.userId, 10);

    try {
      const userSkills = await userSkillRepository.findByUserId(userId);
      return res.status(200).json(userSkills);
    } catch (error) {
      return res.status(500).json({
        message: 'Error al obtener las habilidades del usuario',
        error,
      });
    }
  }

  // Listar todos los userSkills con paginación
  static async findAll(req: Request, res: Response) {
    const page = parseInt(req.query.page as string, 10) || 1;
    const perPage = parseInt(req.query.perPage as string, 10) || 10;

    try {
      const { data: userSkills, total } = await userSkillRepository.findAll(
        page,
        perPage,
      );
      return res.status(200).json({
        data: userSkills,
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Error al listar las habilidades del usuario',
        error,
      });
    }
  }

  // Obtener un userSkill por ID
  static async findById(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);

    try {
      const userSkill = await userSkillRepository.findById(id);
      if (!userSkill) {
        return res
          .status(404)
          .json({ message: 'Habilidad del usuario no encontrada' });
      }
      return res.status(200).json(userSkill);
    } catch (error) {
      return res.status(500).json({
        message: 'Error al obtener la habilidad del usuario',
        error,
      });
    }
  }

  // Actualizar un userSkill por ID
  static async update(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);
    const updatedUserSkillData = req.body;

    try {
      const updatedUserSkill = await userSkillRepository.update(
        id,
        updatedUserSkillData,
      );
      if (!updatedUserSkill) {
        return res
          .status(404)
          .json({ message: 'Habilidad del usuario no encontrada' });
      }
      return res.status(200).json(updatedUserSkill);
    } catch (error) {
      return res.status(500).json({
        message: 'Error al actualizar la habilidad del usuario',
        error,
      });
    }
  }

  // Eliminar un userSkill por ID
  static async delete(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);

    try {
      await userSkillRepository.delete(id);
      return res
        .status(200)
        .json({ message: 'Habilidad del usuario eliminada con éxito' });
    } catch (error) {
      return res.status(500).json({
        message: 'Error al eliminar la habilidad del usuario',
        error,
      });
    }
  }
}
