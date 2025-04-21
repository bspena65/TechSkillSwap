
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";
import { Language } from "./Language";

@Entity({ name: "UserLanguages" })
export class UserLanguage {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.userLanguages, { onDelete: "CASCADE" })
    user: User;

    @ManyToOne(() => Language, (language) => language.userLanguages, { onDelete: "CASCADE" })
    language: Language;

    @Column({ name: "proficiency_level", length: 50, nullable: true })
    proficiencyLevel: string;

    @Column({ name: "years_of_experience", nullable: true })
    yearsOfExperience: number;
}
