import { Db, MongoClient } from 'mongodb';

let _connection: MongoClient = undefined;
let _db: Db = undefined;

const connect = async () => {
    if (!_connection) {
        const mongoConfig = {
            serverUrl: `mongodb://${process.env.DB_HOST}:27017/`,
            database: "NextRound"
        };
        _connection = await MongoClient.connect(mongoConfig.serverUrl);
        _db = _connection.db(mongoConfig.database);
    }
    return _db;
};

export default connect;