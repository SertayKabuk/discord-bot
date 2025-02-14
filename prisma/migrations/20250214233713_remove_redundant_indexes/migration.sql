-- DropIndex
DROP INDEX "presence_logs_guild_id_idx";

-- DropIndex
DROP INDEX "voice_state_logs_user_id_idx";

-- CreateIndex
CREATE INDEX "presence_logs_guild_date_index" ON "presence_logs"("guild_id", "created_at");

-- CreateIndex
CREATE INDEX "voice_state_logs_user_date_index" ON "voice_state_logs"("user_id", "created_at");
