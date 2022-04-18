import seedDB from './seed';

const main = async () => {
    const seed = await seedDB();
    console.log('Database has been seeded!');
    process.exit();
}

main();
