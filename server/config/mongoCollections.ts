import dbConnection from './mongoConnection';

/* This will allow you to have one reference to each collection per app */
const getCollectionFn = (collection: string) => {
    let _col = undefined;

    return async () => {
        if (!_col) {
            const db = await dbConnection();
            _col = db.collection(collection);
        }

        return _col;
    };
};

/* Now, you can list your collections here: */

const collections = {
    cycles: getCollectionFn('cycles'),
    media: getCollectionFn('media'),
    users: getCollectionFn('users')
};

export default collections;