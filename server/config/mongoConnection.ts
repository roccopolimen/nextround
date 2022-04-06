import { Db, MongoClient } from 'mongodb';
import settingsJson from './settings.json';
const { mongoConfig } = settingsJson;

let _connection: MongoClient = undefined;
let _db: Db = undefined;

const connect = async () => {
    if (!_connection) {
        _connection = await MongoClient.connect(mongoConfig.serverUrl);
        _db = _connection.db(mongoConfig.database);
    }
    return _db;
};

export default connect;