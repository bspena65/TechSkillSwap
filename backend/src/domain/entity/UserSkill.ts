import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';
import { Skill } from './Skill';

@Entity({ name: 'UserSkills' })
export class UserSkill {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userSkills, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Skill, (skill) => skill.userSkills, { onDelete: 'CASCADE' })
  skill: Skill;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  @Column({ name: 'years_of_experience', nullable: true })
  yearsOfExperience: number;
}
