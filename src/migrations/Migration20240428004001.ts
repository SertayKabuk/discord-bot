import { Migration } from '@mikro-orm/migrations';

export class Migration20240428004001 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "channel_message" ("id" bigserial primary key, "guild_id" varchar(255) not null, "channel_id" varchar(255) not null, "message_id" varchar(255) not null, "user_id" varchar(255) not null, "username" varchar(255) not null, "created_at" timestamptz not null);');
    this.addSql('create index "channel_message_guild_id_index" on "channel_message" ("guild_id");');

    this.addSql('create table "channel_message_url" ("id" bigserial primary key, "url" varchar(255) not null, "channel_message_id" bigint not null);');
    this.addSql('create index "channel_message_url_url_index" on "channel_message_url" ("url");');

    this.addSql('alter table "channel_message_url" add constraint "channel_message_url_channel_message_id_foreign" foreign key ("channel_message_id") references "channel_message" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "channel_message_url" drop constraint "channel_message_url_channel_message_id_foreign";');

    this.addSql('drop table if exists "channel_message" cascade;');

    this.addSql('drop table if exists "channel_message_url" cascade;');
  }

}
