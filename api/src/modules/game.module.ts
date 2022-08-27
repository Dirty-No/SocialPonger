import { Module } from "@nestjs/common";
import { GameGateway } from "@gateways/game.gateway";
import { MessageModule } from "@modules/message.module";
import { AuthService } from "@services/auth.service";
import { GameService } from "@src/services/game.service";
import { StatusController } from "@src/controllers/status.controller";
import { UserModule } from "./user.module";
import { StoredGameModule } from "./stored-game.module";

@Module({
	imports: [MessageModule, UserModule, StoredGameModule],
	controllers: [StatusController],
	providers: [GameGateway, AuthService, GameService],
})
export class GameModule {}
