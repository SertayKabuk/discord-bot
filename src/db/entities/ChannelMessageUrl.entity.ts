import { Entity, PrimaryKey, Property, ManyToOne, Unique, Index } from '@mikro-orm/core';
import { ChannelMessage } from './ChannelMessage.entity';

@Entity()
export class ChannelMessageUrl {
    @PrimaryKey({ type: 'bigint' })
    id!: string;

    @Property()
    @Index()
    url!: string;

    @ManyToOne() // plain decorator is enough, type will be sniffer via reflection!
    channelMessage!: ChannelMessage;
}