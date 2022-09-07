import { useEffect, useState } from "react";
import { UserInfo } from "remult";

const Auth: React.FC<{ children: JSX.Element }> = ({ children }) => {
    const [signInUsername, setSignInUsername] = useState("");
    const [currentUser, setCurrentUser] = useState<UserInfo>();

    const signIn = async () => {
        const result = await fetch('/api/signIn', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: signInUsername })
        });
        if (result.ok) {
            setCurrentUser(await result.json());
            setSignInUsername("");
        }
        else alert(await result.json());
    }
    const signOut = async () => {
        await fetch('/api/signOut', {
            method: "POST"
        });
        setCurrentUser(undefined);
    }
    useEffect(() => {
        fetch('/api/currentUser').then(r => r.json())
            .then(async currentUserFromServer => {
                setCurrentUser(currentUserFromServer)
            });
    }, []);

    if (!currentUser)
        return (
            <header>
                <input value={signInUsername}
                    onChange={e => setSignInUsername(e.target.value)}
                    placeholder="Username, try Steve or Jane" />
                <button onClick={signIn}>Sign in</button>
            </header>);
    return <>
        <header>
            Hello {currentUser.name} <button onClick={signOut}>Sign Out</button>
        </header>
        {children}
    </>
}
export default Auth;
