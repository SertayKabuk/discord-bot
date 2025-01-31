import { Entity, PrimaryKey, Property, OneToMany, Collection, Index } from '@mikro-orm/core';
import { ChannelMessageUrl } from './ChannelMessageUrl.entity.js';

@Entity()
export class ChannelMessage {
  @PrimaryKey({ type: 'bigint' })
  id!: string;

  @Property()
  @Index()
  guildId!: string;

  @Property()
  channelId!: string;

  @Property()
  messageId!: string;

  @Property()
  userId!: string;

  @Property()
  username!: string;

  @Property()
  createdAt!: Date;

  @OneToMany(() => ChannelMessageUrl, url => url.channelMessage)
  urls = new Collection<ChannelMessageUrl>(this);
}