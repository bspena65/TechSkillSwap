import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Chat } from './Chat';
import { User } from './User';

@Entity({ name: 'Messages' })
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Chat, (chat) => chat.messages, { onDelete: 'CASCADE' })
  @Index()
  chat: Chat;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  sender: User;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn({ name: 'sent_at' })
  sentAt: Date;
}
