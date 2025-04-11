import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity({ name: "UserProfessionalStudies" })
export class UserProfessionalStudy {
  @PrimaryGeneratedColumn()
  study_id: number;

  @ManyToOne(() => User, (user) => user.userProfessionalStudies, { onDelete: "CASCADE" })
  user: User;

  @Column({ length: 100 })
  degree: string;

  @Column({ length: 100, nullable: true })
  institution: string;

  @Column({ type: "date", nullable: true })
  start_date: Date;

  @Column({ type: "date", nullable: true })
  end_date: Date;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "text", nullable: true })
  level_study: string;

  @Column({ type: "text", nullable: true })
  state: string;
}
