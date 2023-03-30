import CounterRun from "./views/counterRun";
import "./styles/bootstrap.min.css";
import "./styles/app.css";
import Firebase from "firebase/compat/app";
import "firebase/auth";
import config from "./config.js";
import Login from "./views/Login";
import { useState } from "react";
export default function App() {
  const [user, setUser] = useState();
  if (!Firebase.apps.length) {
    Firebase.initializeApp(config);
  }

  Firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      // Your code here for authenticated user
      setUser(user);
    } else {
      // No user is signed in.
      setUser();
    }
  });
  if (user)
    return (
      <div>
        <CounterRun />
        <button onClick={() => Firebase.auth().signOut()}>logout</button>
      </div>
    );

  return <Login />;
}
