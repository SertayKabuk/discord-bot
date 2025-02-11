-- CreateTable
CREATE TABLE "channel_messages" (
    "id" BIGSERIAL NOT NULL,
    "guild_id" CHAR(20) NOT NULL,
    "channel_id" CHAR(20) NOT NULL,
    "message_id" CHAR(20) NOT NULL,
    "user_id" CHAR(20) NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "channel_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channel_message_urls" (
    "id" BIGSERIAL NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "message_id" BIGINT NOT NULL,

    CONSTRAINT "channel_message_urls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "presence_logs" (
    "id" BIGSERIAL NOT NULL,
    "guild_id" CHAR(20) NOT NULL,
    "user_id" CHAR(20) NOT NULL,
    "username" TEXT,
    "old_status" TEXT,
    "new_status" TEXT,
    "old_activity" TEXT,
    "new_activity" TEXT,
    "client_status" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "presence_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "channel_messages_guild_id_index" ON "channel_messages"("guild_id");

-- CreateIndex
CREATE INDEX "channel_message_urls_url_index" ON "channel_message_urls"("url");

-- CreateIndex
CREATE INDEX "channel_message_urls_message_id_index" ON "channel_message_urls"("message_id");

-- AddForeignKey
ALTER TABLE "channel_message_urls" ADD CONSTRAINT "channel_message_urls_message_id_foreign" FOREIGN KEY ("message_id") REFERENCES "channel_messages"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
