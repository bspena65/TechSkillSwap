import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { SkillCategory } from "./SkillCategories";
import { UserSkill } from "./UserSkill";


@Entity({ name: "Skills" })
export class Skill {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "skill_name", length: 100, unique: true })
    skillName: string;

    @ManyToOne(() => SkillCategory, (category) => category.skills, { onDelete: "SET NULL" })
    category: SkillCategory;

    @OneToMany(() => UserSkill, (userSkill) => userSkill.skill)
    userSkills: UserSkill[];
}
