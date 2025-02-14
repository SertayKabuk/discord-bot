/*
  Warnings:

  - You are about to alter the column `username` on the `presence_logs` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `old_status` on the `presence_logs` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `new_status` on the `presence_logs` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `client_status` on the `presence_logs` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(200)`.

*/
-- AlterTable
ALTER TABLE "presence_logs" ALTER COLUMN "username" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "old_status" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "new_status" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "client_status" SET DATA TYPE VARCHAR(200);

-- CreateTable
CREATE TABLE "voice_state_logs" (
    "id" BIGSERIAL NOT NULL,
    "user_id" VARCHAR(20) NOT NULL,
    "from_guild_id" VARCHAR(20) NOT NULL,
    "from_guild_name" VARCHAR(200) NOT NULL,
    "to_guild_id" VARCHAR(20) NOT NULL,
    "to_guild_name" VARCHAR(200) NOT NULL,
    "from_channel_id" VARCHAR(20) NOT NULL,
    "from_channel_name" VARCHAR(100) NOT NULL,
    "to_channel_id" VARCHAR(20) NOT NULL,
    "to_channel_name" VARCHAR(100) NOT NULL,
    "username" VARCHAR(255),
    "event_type" VARCHAR(20),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "voice_state_logs_pkey" PRIMARY KEY ("id")
);
