import { PrismaClient } from '@prisma/client';

class DbHelper {
    private static instance: DbHelper;
    prisma: PrismaClient;

    private constructor() {
        this.prisma = new PrismaClient();
    }

    static getInstance(): DbHelper {
        if (!DbHelper.instance) {
            DbHelper.instance = new DbHelper();
        }
        return DbHelper.instance;
    }
}

const dbHelper = DbHelper.getInstance();

export default dbHelper;