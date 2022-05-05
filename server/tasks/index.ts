import seedDB from './seed';
import dotenv from 'dotenv';
import path from 'path';
import seedFirebase from './firebase-seed';

dotenv.config({ path: path.resolve() + '/.env' });

const main = async () => {
    await seedDB();
    console.log('Database has been seeded!');
    await seedFirebase();
    console.log('Firebase has been seeded!');
    process.exit();
}

main();
