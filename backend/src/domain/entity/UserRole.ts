
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Role } from "./Role";

@Entity({ name: "UserRoles" })
export class UserRole {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.userRoles, { onDelete: "CASCADE" })
    user: User;

    @ManyToOne(() => Role, (role) => role.userRoles, { onDelete: "CASCADE" })
    role: Role;
}
