import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChanInvitation } from "@entities/chan_invitation.entity";
import { Container } from "typedi";
import { InviteQuery } from "@src/queries/inviteQuery";

@Injectable()
export class ChanInvitationService {
	constructor(
		@InjectRepository(ChanInvitation)
		private ChanInvitationRepository: Repository<ChanInvitation>,
	) {
		Container.set(this.constructor, this);
	}

	getQuery() {
		return new InviteQuery(this.ChanInvitationRepository);
	}

	findAll(userId: string, page = 1, itemByPage = 10): Promise<ChanInvitation[]> {
		return this.getQuery().in_invitation(userId).paginate(page, itemByPage).getMany();
	}

	findOne(id: number): Promise<ChanInvitation> {
		return this.getQuery().getOne(id);
	}

	async remove(id: number): Promise<void> {
		await this.getQuery().remove(id);
	}

	create(chanInvitation: ChanInvitation): Promise<ChanInvitation> {
		return this.save(this.ChanInvitationRepository.create(chanInvitation));
	}

	async save(chanInvitation: ChanInvitation): Promise<ChanInvitation> {
		return await this.ChanInvitationRepository.save(chanInvitation);
	}

	update(id: number, chanInvitation: ChanInvitation) {
		return this.getQuery().update(id, chanInvitation);
	}
	async findByChannel(id: number): Promise<ChanInvitation[]> {
		return this.getQuery().channel(id).getMany();
	}
	async findByChannelAndCount(id: number, page = 1, itemByPage = 10): Promise<[ChanInvitation[], number]> {
		return this.getQuery().channel(id).paginate(page, itemByPage).getManyAndCount();
	}
}
