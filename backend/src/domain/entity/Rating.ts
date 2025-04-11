import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  ManyToOne,
} from 'typeorm';
import { ChatParticipant } from './ChatParticipant';
import { User } from './User';

@Entity({ name: 'Ratings' })
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  // Campo para el rating entre 0.0 y 5.0
  @Column('decimal', { precision: 2, scale: 1, default: 0.0 })
  rate: number;

  // Mensaje opcional de la calificación
  @Column({ type: 'text', nullable: true })
  message: string;

  // Fecha de creación de la calificación
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relación ManyToOne con la entidad User (usuario que realiza la calificación)
  @ManyToOne(() => User, (user) => user.ratings, { onDelete: 'CASCADE' })
  ownerCalificate: User;

  @ManyToOne(() => User, (user) => user.ratings, { onDelete: 'CASCADE' })
  calificator: User;

  // Relación OneToOne con ChatParticipant
  @OneToOne(
    () => ChatParticipant,
    (chatParticipant) => chatParticipant.rating,
    { onDelete: 'CASCADE' },
  )
  chatParticipant: ChatParticipant;
}
