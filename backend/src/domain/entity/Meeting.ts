import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User';
import { Chat } from './Chat';

@Entity({ name: 'Meetings' })
export class Meeting {
  @PrimaryGeneratedColumn()
  id: number;

  // Relación con User como organizador de la reunión
  @ManyToOne(() => User, (user) => user.id, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'organizer_id' }) // Clave externa hacia User (organizador)
  organizer: User;

  // Nueva relación con Chat
  @ManyToOne(() => Chat, (chat) => chat.id, { onDelete: 'SET NULL' }) // Si el chat es eliminado, el campo se pone a NULL
  @JoinColumn({ name: 'chat_id' }) // Clave externa para asociar el chat
  chat: Chat;

  @Column({ name: 'title', length: 100 })
  title: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  @Column({ name: 'start_time', type: 'timestamp' })
  startTime: Date;

  @Column({ name: 'end_time', type: 'timestamp' })
  endTime: Date;

  @Column({ name: 'meet_link', length: 255, nullable: true })
  meet_link: string;

  @Column({ name: 'status', length: 50 })
  status: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
