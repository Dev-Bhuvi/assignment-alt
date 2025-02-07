import React from "react";
import { auth, googleProvider } from "../firebase/firebaseConfig";
import { signInWithPopup, signOut } from "firebase/auth";
import './Auths.css';
import loginbg from '../images/loginbg.png';
import taskbuddy from '../images/taskbuddy.png';
import google from '../images/google.png';


const Auth = ({ user, setUser }) => {
    const signIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            setUser(result.user);
        } catch (error) {
            console.error("Error signing in:", error);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <div>
            {user ? (
                <>
                </>
            ) : (

                <div className="container-fluid loginbackground">
                    <div className="row">
                        <div className="col-md-6 d-flex flex-column align-items-center justify-content-center">
                            <div className="logincard ps-4">
                                <img src={taskbuddy} alt="loginbg" className="img-fluid taskbuddy" />
                                <p>Streamline your workflow and track progress effortlessly<br/> with our all-in-one task management app.</p>
                           
                                <button className="signinbtn text-start" onClick={signIn}>
                                    <img src={google} className="img-fluid"/> Continue with Google</button>
                            </div>
                        </div>

                        <div className="col-md-6 text-end">
                            <img src={loginbg} alt="loginbg" className="img-fluid loginbg mobhide" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Auth;
