import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Unique, CreateDateColumn, Check } from "typeorm";
import { User } from "@entities/user.entity";
import { setService } from "@utils/setFinalType.decorator";
import { UserService } from "@services/user.service";
import { SetMode } from "@utils/set-mode";

export enum RelationType {
	FRIEND,
	FRIEND_REQUEST,
	BLOCK,
}

// this entity is use to know the relation between the user

@Entity()
@Unique("unique_relation", ["owner", "target", "type"])
@Check('"ownerId" <> "targetId"')
export class Relation {
	@PrimaryGeneratedColumn()
	@SetMode("r")
	id: number;

	// user one is the user who owned the relation
	@ManyToOne(() => User, (user_one) => user_one.id, { eager: true, onDelete: "CASCADE" })
	@setService(UserService)
	@SetMode("cr")
	owner: User | string;

	// user two is the user which the user one have a relation
	@ManyToOne(() => User, (user_two) => user_two.id, { eager: true, onDelete: "CASCADE" })
	@setService(UserService)
	@SetMode("cr")
	target: User | string;

	// type of relation
	@Column({
		type: "enum",
		enum: RelationType,
	})
	@SetMode("cr")
	type: RelationType;

	// date of creation
	@CreateDateColumn()
	@SetMode("r")
	created_at: Date;
}
