
import React, { useState, useEffect } from "react";
import Auth from "./components/Auth";
import TaskManager from "./components/TaskManager";
import { auth } from "./firebase/firebaseConfig";

const App = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    return (
        <div>
            <Auth user={user} setUser={setUser} />
            <TaskManager user={user} />
        </div>
    );
};

export default App;
