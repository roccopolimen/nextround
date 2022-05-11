import { applicationDefault, initializeApp } from 'firebase-admin/app';
import { getAuth, ListUsersResult, UserRecord } from "firebase-admin/auth";
import dotenv from 'dotenv';
import path from 'path';


dotenv.config({ path: path.resolve() + '/.env' });
initializeApp({
    credential: applicationDefault()
});

const seedFirebase = async (): Promise<void> => {

    // Remove current users
    try {
        const currentUsers: ListUsersResult = await getAuth().listUsers();
        const allUids: Array<string> = currentUsers.users.map((user: UserRecord) => user.uid);
        await getAuth().deleteUsers(allUids);
    } catch(e) {
        console.log(e.message);
        console.log('Removing users did not work... aborting seeding Firebase.');
        return;
    }

    // function to add a user
    const addUser = async (email: string, password: string, displayName: string): Promise<void> => {
        try {
            await getAuth().createUser({
                email: email,
                emailVerified: false,
                password: password,
                displayName: displayName,
                disabled: false
            });
        } catch(e) {
            console.log(e.message);
            console.log('failed to create user:', email);
        }
    };

    // users to add based on seed script
    await addUser('mkarsen@stevens.edu', 'password1', 'Michael Henry Karsen IV');
    await addUser('rpolimen@stevens.edu', 'password2', 'Rocco Polimeni');
    await addUser('mpolimen@stevens.edu', 'password3', 'Marco Polimeni');
    await addUser('bwormser@stevens.edu', 'password4', 'Brian Wormser');
    await addUser('gmattern@stevens.edu', 'password5', 'Grace Mattern');
    await addUser('phill@stevens.edu', 'inanutshell', 'Patrick Hill');

};

export default seedFirebase;