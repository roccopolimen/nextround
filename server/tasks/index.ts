import seedDB from './seed';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve() + '/.env' });

const main = async () => {
    const seed = await seedDB();
    console.log('Database has been seeded!');
    process.exit();
}

main();
