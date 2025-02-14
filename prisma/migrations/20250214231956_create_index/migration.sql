-- CreateIndex
CREATE INDEX "presence_logs_guild_id_idx" ON "presence_logs"("guild_id");

-- CreateIndex
CREATE INDEX "voice_state_logs_user_id_idx" ON "voice_state_logs"("user_id");
