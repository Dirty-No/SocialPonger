import { Controller, Delete, Get, Param } from "@nestjs/common";

@Controller("users")
export class UsersController {
	@Get()
	getAll(): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}

	@Get(":id")
	getOne(@Param("id") _id: string): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}

	@Delete(":id")
	removeInvitation(@Param("id") _id: string): Promise<object> {
		return Promise.resolve({ foo: "bar" });
	}
}
