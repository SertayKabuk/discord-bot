import { EntityManager } from "@mikro-orm/core";
import ormConfig from './mikro-orm.config.js';
import { PostgreSqlDriver, MikroORM } from '@mikro-orm/postgresql';

class DbHelper {
    private static instance: DbHelper;
    em!: EntityManager;

    private constructor() {}

    static getInstance(): DbHelper {
        if (!DbHelper.instance) {
            DbHelper.instance = new DbHelper();
        }
        return DbHelper.instance;
    }

    async init() {
        const orm = await MikroORM.init<PostgreSqlDriver>(ormConfig);
        this.em = orm.em;
    }

    async migrate() {
        const orm = await MikroORM.init<PostgreSqlDriver>(ormConfig);
        const migrator = orm.getMigrator();
        await migrator.up(); // runs migrations up to the latest
    }
}

const dbHelper = DbHelper.getInstance();

export default dbHelper;