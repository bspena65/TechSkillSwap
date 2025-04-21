import { Request, Response } from 'express';
import { SkillRepository } from '../../domain/repositories/SkillRepository';

const skillRepository = new SkillRepository();

export class SkillController {
  // Crear un nuevo skill
  static async create(req: Request, res: Response) {
    const skillData = req.body;
    try {
      const skill = await skillRepository.save(skillData);
      return res.status(201).json(skill);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error al crear el skill', error });
    }
  }

  static async findAllList(req: Request, res: Response) {
    try {
      const languages = await skillRepository.findAllList();
      return res.status(200).json(languages);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error al listar los lenguajes', error });
    }
  }

  // Listar todos los skills con paginación y relación con SkillCategory
  static async findAll(req: Request, res: Response) {
    const page = parseInt(req.query.page as string, 10) || 1;
    const perPage = parseInt(req.query.perPage as string, 10) || 10;

    try {
      const { data: skills, total } = await skillRepository.findAll(
        page,
        perPage,
      );

      return res.status(200).json({
        data: skills,
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error al listar los skills', error });
    }
  }

  // Obtener un skill por ID
  static async findById(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);

    try {
      const skill = await skillRepository.findById(id);
      if (!skill) {
        return res.status(404).json({ message: 'Skill no encontrado' });
      }
      return res.status(200).json(skill);
    } catch (error) {
      console.error('error', JSON.stringify(error));

      return res
        .status(500)
        .json({ message: 'Error al obtener el skill', error });
    }
  }

  // Actualizar un skill por ID
  static async update(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);
    const updatedSkillData = req.body;

    try {
      const updatedSkill = await skillRepository.update(id, updatedSkillData);
      if (!updatedSkill) {
        return res.status(404).json({ message: 'Skill no encontrado' });
      }
      return res.status(200).json(updatedSkill);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error al actualizar el skill', error });
    }
  }

  // Eliminar un skill por ID
  static async delete(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);

    try {
      await skillRepository.delete(id);
      return res.status(200).json({ message: 'Skill eliminado con éxito' });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error al eliminar el skill', error });
    }
  }
}
