-- AlterTable
ALTER TABLE "channel_messages" ALTER COLUMN "guild_id" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "channel_id" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "message_id" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "user_id" SET DATA TYPE VARCHAR(20);

-- AlterTable
ALTER TABLE "presence_logs" ALTER COLUMN "guild_id" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "user_id" SET DATA TYPE VARCHAR(20);

-- CreateIndex
CREATE INDEX "channel_message_urls_url_message_id_index" ON "channel_message_urls"("url", "message_id");
