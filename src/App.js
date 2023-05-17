import CounterRun from "./views/counterRun";
import "./styles/bootstrap.min.css";
import "./styles/app.css";
import Firebase from "firebase/compat/app";
import "firebase/auth";
import config from "./config.js";
import Login from "./views/Login";
import { useState } from "react";
import Counters from "./views/Counters";
import { Button } from "reactstrap";
export default function App() {
  const [user, setUser] = useState(null);
  if (!Firebase.apps.length) {
    Firebase.initializeApp(config);
  }

  Firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      // Your code here for authenticated user
      setTimeout(() => {
        
        setUser(user);
      }, 150);
    } else {
      // No user is signed in.
      setUser();
    }
  });
  if (user)
    return (
      <div className="text-center">
        {/* <CounterRun /> */}
        <Counters />
        <Button color="danger" onClick={() =>{
          localStorage.removeItem('auth_info')
          Firebase.auth().signOut()}}>
          Logout
        </Button>
      </div>
    );
  if (user ==undefined) return <Login />;
  return "";
}
