import { Injectable } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { Channel } from "@src/entities/channel.entity";
import { Container } from "typedi";
import { ChanConnection } from "@entities/chan_connection.entity";
import { ChannelQuery } from "@src/queries/channelQuery";

@Injectable()
export class ChannelService {
	constructor(
		@InjectRepository(Channel)
		private ChannelRepository: Repository<Channel>,
		@InjectEntityManager("default")
		private entityManager: EntityManager,
	) {
		Container.set(this.constructor, this);
	}

	getQuery() {
		return new ChannelQuery(this.ChannelRepository);
	}

	findOne(id: number): Promise<Channel> {
		return this.ChannelRepository.findOneBy({ id });
	}

	findByConnection(id: number): Promise<Channel> {
		return this.entityManager
			.createQueryBuilder()
			.select("channel")
			.from(Channel, "channel")
			.leftJoin(ChanConnection, "chan_connection", "chan_connection.chanIdId = channel.id")
			.where("chan_connection.chanIdId = :id", { id })
			.getOne();
	}

	async remove(id: number): Promise<void> {
		await this.getQuery().remove(id);
	}

	create(channel: Channel): Promise<Channel> {
		return this.save(this.ChannelRepository.create(channel));
	}

	async save(channel: Channel): Promise<Channel> {
		return await this.ChannelRepository.save(channel);
	}

	update(id: number, channel: Channel) {
		return this.getQuery().update(id, channel);
	}
}
