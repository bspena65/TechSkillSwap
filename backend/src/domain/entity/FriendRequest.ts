import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';
import { Skill } from './Skill';
import { Chat } from './Chat';

@Entity({ name: 'FriendRequests' })
export class FriendRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.sentFriendRequests, {
    onDelete: 'CASCADE',
  })
  sender: User;

  @ManyToOne(() => User, (user) => user.receivedFriendRequests, {
    onDelete: 'CASCADE',
  })
  receiver: User;

  @Column({ name: 'status', length: 50 })
  status: string;

  @ManyToOne(() => Skill, { nullable: true })
  skillSender: Skill;

  @ManyToOne(() => Skill, { nullable: true })
  skillReceiver: Skill;

  @Column({ name: 'message', type: 'text', nullable: true })
  message: string;

  @ManyToOne(() => Chat, { nullable: true })
  chat: Chat;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({ name: 'response_at', type: 'timestamp', nullable: true })
  responseAt: Date;
}
