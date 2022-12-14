import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChanConnection } from "@entities/chan_connection.entity";
import { Container } from "typedi";
import { ChanConnectionQuery } from "@src/queries/chanConnectionQuery";
import { DeepPartial } from "typeorm/common/DeepPartial";

@Injectable()
export class ChanConnectionService {
	constructor(
		@InjectRepository(ChanConnection)
		private ChanConnectionRepository: Repository<ChanConnection>,
	) {
		Container.set(this.constructor, this);
	}

	getQuery() {
		return new ChanConnectionQuery(this.ChanConnectionRepository);
	}

	findOne(id: number): Promise<ChanConnection> {
		return this.getQuery().getOne(id);
	}

	async remove(id: number): Promise<void> {
		await this.getQuery().remove(id);
	}

	create(chanConnection: DeepPartial<ChanConnection>): Promise<ChanConnection> {
		return this.save(this.ChanConnectionRepository.create(chanConnection));
	}

	async save(chanConnection: ChanConnection): Promise<ChanConnection> {
		return await this.ChanConnectionRepository.save(chanConnection);
	}

	async findByUser(id: string): Promise<ChanConnection[]> {
		return this.getQuery().user(id).getMany();
	}

	async findByChannel(id: number): Promise<ChanConnection[]> {
		return this.getQuery().channel(id).getMany();
	}

	async isOnChannel(userId: string, channelId: number): Promise<boolean> {
		return !!(await this.getQuery().channel(channelId).user(userId).query.getOne());
	}
}
