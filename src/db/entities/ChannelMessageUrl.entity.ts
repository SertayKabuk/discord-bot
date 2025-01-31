import { Entity, PrimaryKey, Property, ManyToOne, Rel, Index } from '@mikro-orm/core';
import { ChannelMessage } from './ChannelMessage.entity.js';

@Entity()
export class ChannelMessageUrl {
    @PrimaryKey({ type: 'bigint' })
    id!: string;

    @Property()
    @Index()
    url!: string;

    @ManyToOne(() => ChannelMessage)
    channelMessage!: Rel<ChannelMessage>;
}