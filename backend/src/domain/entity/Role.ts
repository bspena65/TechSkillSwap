
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { UserRole } from "./UserRole";

@Entity({ name: "Roles" })
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "role_name", length: 50, unique: true })
    roleName: string;

    @OneToMany(() => UserRole, (userRole) => userRole.role)
    userRoles: UserRole[];
}
