import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class GameExistGuard implements CanActivate {
	canActivate(_context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		return true;
	}
}