import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Skill } from "./Skill";

@Entity({ name: "SkillCategories" })
export class SkillCategory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "category_name", length: 100, unique: true })
    categoryName: string;

    @OneToMany(() => Skill, (skill) => skill.category)
    skills: Skill[];
}
