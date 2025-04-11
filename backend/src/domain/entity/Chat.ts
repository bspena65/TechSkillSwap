import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChatParticipant } from './ChatParticipant';
import { Message } from './Message';

export enum ChatStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
}

@Entity({ name: 'Chats' })
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({
    type: 'enum',
    enum: ChatStatus,
    default: ChatStatus.ACTIVE,
  })
  status: ChatStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => ChatParticipant, (participant) => participant.chat)
  participants: ChatParticipant[];

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];
}
