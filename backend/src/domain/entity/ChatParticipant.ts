import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Unique,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Chat } from './Chat';
import { User } from './User';
import { Rating } from './Rating';

@Entity({ name: 'ChatParticipants' })
@Unique(['chat', 'user'])
export class ChatParticipant {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Chat, (chat) => chat.participants, { onDelete: 'CASCADE' })
  chat: Chat;

  @ManyToOne(() => User, (user) => user.chatParticipants, {
    onDelete: 'CASCADE',
  })
  user: User;

  @CreateDateColumn({ name: 'joined_at' })
  joinedAt: Date;

  // Relación OneToOne con Rating
  @OneToOne(() => Rating, (rating) => rating.chatParticipant, { cascade: true })
  @JoinColumn() // JoinColumn es necesario en relaciones OneToOne
  rating: Rating;
}
