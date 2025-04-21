
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { UserLanguage } from "./UserLanguage";

@Entity({ name: "Languages" })
export class Language {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "language_name", length: 50, unique: true })
    languageName: string;

    @OneToMany(() => UserLanguage, (userLanguage) => userLanguage.language)
    userLanguages: UserLanguage[];
}
