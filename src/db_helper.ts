import { EntityManager } from "@mikro-orm/core";
import ormConfig from './mikro-orm.config';
import { PostgreSqlDriver, MikroORM } from '@mikro-orm/postgresql';

class DbHelper {
    em!: EntityManager;

    async init() {
        const orm = await MikroORM.init<PostgreSqlDriver>(ormConfig);
        this.em = orm.em;
    }
}

const dbHelper = new DbHelper();

export default dbHelper;