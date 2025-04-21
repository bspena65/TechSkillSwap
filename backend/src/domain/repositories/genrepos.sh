#!/bin/bash

# Lista de entidades
entities=(
  "Chat"
  "ChatParticipant"
  "FriendRequest"
  "Language"
  "Meeting"
  "MeetingParticipant"
  "Message"
  "Notification"
  "Role"
  "Skill"
  "SkillCategories"
  "UserLanguage"
  "UserRating"
  "UserRole"
  "UserSkill"
)

# Recorrer la lista de entidades y crear un repositorio para cada una
for entity in "${entities[@]}"
do
  file_name="${entity}Repository.ts"
  entity_var="$(tr '[:upper:]' '[:lower:]' <<< ${entity:0:1})${entity:1}"

  cat <<EOL > "$file_name"
import { AppDataSource } from '../../infrastructure/persistence/typeormSource';
import { ${entity} } from '../entity/${entity}';

export class ${entity}Repository {
  private ${entity_var}Repository = AppDataSource.getRepository(${entity});

  // Método para guardar un ${entity_var} (Crear o Actualizar)
  async save(${entity_var}: ${entity}): Promise<${entity}> {
    return await this.${entity_var}Repository.save(${entity_var});
  }

  // Método para obtener todos los ${entity_var}s
  async findAll(): Promise<${entity}[]> {
    return await this.${entity_var}Repository.find();
  }

  // Método para buscar un ${entity_var} por ID (Leer)
  async findById(id: number): Promise<${entity} | undefined> {
    return await this.${entity_var}Repository.findOne({ where: { id } });
  }

  // Método para actualizar un ${entity_var}
  async update(id: number, updated${entity}: Partial<${entity}>): Promise<${entity} | undefined> {
    await this.${entity_var}Repository.update(id, updated${entity});
    return this.findById(id);
  }

  // Método para eliminar un ${entity_var}
  async delete(id: number): Promise<void> {
    await this.${entity_var}Repository.delete(id);
  }
}
EOL

  echo "${entity}Repository created in ${file_name}."
done

echo "All repositories have been generated successfully."
