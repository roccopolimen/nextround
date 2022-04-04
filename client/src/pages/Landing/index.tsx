import { doEmailSignIn, doSignOut } from 'api/firebase/functions';
import { AuthContext } from 'context';
import { useContext } from 'react';
import './style.css';

const Landing = () => {
    const data = useContext(AuthContext);

    const handleSignIn = () => {
        doEmailSignIn('roccopolimen@gmail.com', 'my-password');
    };

    const handleSignOut = () => {
        doSignOut();
    }

    return (
        <div>
            <button onClick={handleSignIn}>Sign in</button>
            <button onClick={handleSignOut}>Sign Out</button>
            <br />
            <br />
            {data ? <p>Logged in</p> : <p>Logged out</p>}
            <br />
            <br />
            {data ? <pre>{JSON.stringify(data, null, 3)}</pre> : null}
        </div>
    );
};

export default Landing;