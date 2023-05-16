import React, { useEffect, useState } from "react";
import Firebase from "firebase/compat/app";
import "firebase/auth";
import "firebase/compat/firestore";
// import PasswordHash from "password-hash";
import config from "../config";
import {ReactComponent as Logo} from "../assets/logo.svg";

// import ReactBSAlert from "react-bootstrap-sweetalert";
// import NotificationAlert from "react-notification-alert";
// import { withCookies, Cookies } from "react-cookie";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  //   InputGroup,
  InputGroupText,
  InputGroup,
  Container,
  Col,
  Row,
} from "reactstrap";

function Login(props) {
  if (props?.location?.hash !== "") {
    console.log("ddd", props);
  }

  const cookies = props?.cookies || {};
  //   cookies?.remove("auth_info");
  //   localStorage.removeItem("auth_info");
  if (!Firebase.apps.length) {
    Firebase.initializeApp(config);
  }

  const [state, setState1] = useState({
    loading: false,
    cookies: cookies,
    email: "",
    password: "",
    rememberMe: "0",

    registerEmailState: "",
    registerPasswordState: "",

    alert: null,
    // address_info: null,

    // google_token: '',
    // facebook_token: '',
    // social_email: '',

    loginData: {},
    functionsBaseURL: "",
  });
  const setState = (e) => {
    setState1((c) => ({ ...c, ...e }));
  };

  useEffect(() => {
    document.body.classList.toggle("login-page");
    setState({ functionsBaseURL: config.baseURL });
    return () => {
      document.body.classList.toggle("login-page");
    };
  }, []);

  const handleChange = (event, stateName, type) => {
    switch (type) {
      case "email":
        if (verifyEmail(event.target.value)) {
          setState({ [stateName + "State"]: "has-success" });
          const { name, value } = event.target;
          setState({ [name]: value });
        } else {
          setState({ [stateName + "State"]: "has-danger" });
        }
        break;
      case "password":
        if (verifyLength(event.target.value, 1)) {
          setState({ [stateName + "State"]: "has-success" });
          const { name, value } = event.target;
          setState({ [name]: value });
        } else {
          setState({ [stateName + "State"]: "has-danger" });
        }
        break;
      case "remember":
        if (state.rememberMe === "1") {
          setState({ rememberMe: "0" });
        } else {
          const { name } = event.target;
          setState({ [name]: "1" });
        }
        break;
      default:
        break;
    }
    setState({ [stateName]: event.target.value });
  };
  const handleSignIn = () => {
    if (state.registerEmailState === "") {
      setState({ registerEmailState: "has-danger" });
    }

    if (
      state.registerPasswordState === ""
      // || state.registerConfirmPasswordState === ""
    ) {
      setState({ registerPasswordState: "has-danger" });
      // setState({ registerConfirmPasswordState: "has-danger" });
    }

    if (
      state.registerEmailState === "has-success" &&
      state.registerPasswordState === "has-success"
    ) {
      var loginData = {
        email: state.email.toLowerCase().trim(),
        password: state.password.trim(),
        rememberMe: state.rememberMe,
      };

      signIn(loginData);
    }
    // console.log("handleSignIn loginData==>",loginData);
  };
  /**
   * update Using firebase authentication module(added)
   * 2020-04-21 by
   * author: moonlight
   * */
  const signIn = (loginData) => {
    setState({ loginData: loginData });
    setState({ loading: true });
    var now = new Date();
    var last_activity_date = now;
    Firebase.auth()
      .signInWithEmailAndPassword(loginData.email, loginData.password)
      .then((credential) => {
        // console.log("auth().currentUser==>", Firebase.auth().currentUser);
        Firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            // console.log("auth().token==>", Firebase.auth().token);

            let ref1 = Firebase.firestore()
              .collection("Web_App_Users")
              .doc(loginData.email.toLowerCase());
            ref1.get().then(function (app_user) {
              if (app_user.exists) {
                let currentUser = Firebase.auth().currentUser;
                currentUser.getIdToken().then(function (token) {
                  // console.log("token", token);

                  const requestOptions = {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                  };

                  let functionsBaseURL =
                    state.functionsBaseURL + "createUserToken";
                  let url = new URL(functionsBaseURL),
                    params = {
                      uid: currentUser.uid,
                      email: loginData.email.toLowerCase(),
                    };
                  Object.keys(params).forEach((key) =>
                    url.searchParams.append(key, params[key])
                  );
                  fetch(url, requestOptions)
                    .then((response) => response.json())
                    .then((tokenData) => {
                      // console.log("tokenData",tokenData, "tokenData.status", tokenData.status);
                      if (tokenData.status === "success") {
                        // if (PasswordHash.verify(loginData.password, app_user.data().Password)) {
                        if (app_user.data().Activated) {
                          if (app_user.data().OTP_Enabled) {
                            setState({ loading: false });
                            // inputAlert();
                          } else {
                            var auth_info = {
                              customer_id: tokenData.customer_id,
                              email: tokenData.email,
                              role: tokenData.role,
                              support_admin_role: tokenData.support_admin_role,
                              username: tokenData.username,
                              ...(!!app_user.data()?.First_Time_Login !=
                              undefined
                                ? {
                                    first_time_login:
                                      app_user.data()?.First_Time_Login,
                                  }
                                : {}),
                            };
                            Firebase.firestore()
                              .collection("Web_App_Users")
                              .doc(app_user.id)
                              .update({
                                Last_Activity_Date: last_activity_date,
                              })
                              .then(function () {
                                // if (_state.rememberMe === "1")
                                //   state.cookies?.set(
                                //     "auth_info",
                                //     auth_info.email
                                //   );

                                localStorage.setItem(
                                  "auth_info",
                                  JSON.stringify(auth_info)
                                );
                                console.log("auth succes");
                                window.setTimeout(function () {
                                  props?.history?.push("/");
                                }, 2000);
                                setState({ loading: false });
                                // notifyMessage("tc", 2, "Login success!");
                              })
                              .catch(function (err) {
                                setState({ loading: false });
                                // notifyMessage("tc", 3, "Network error!");
                                console.log("signIn NetworkError13==>", err);
                              });
                          }
                        } else {
                          setState({ loading: false });
                          //   notifyMessage("tc", 3, "User disabled!");
                        }
                        // } else {
                        //     setState({loading: false});
                        //    notifyMessage("tc", 3, "Incorrect password!");
                        // }
                      } else {
                        setState({ loading: false });
                        // notifyMessage(
                        //   "tc",
                        //   3,
                        //   "An unexpected error occured. Please try again!"
                        // );
                        console.log("Unexpected API error", tokenData.message);
                      }
                    })
                    .catch(function (error) {
                      setState({ loading: false });
                      //   notifyMessage("tc", 3, "Network error!");
                      console.log("signIn NetworkError14==>", error);
                    });
                });
              } else {
                setState({ loading: true });
                // notifyMessage(
                //   "tc",
                //   3,
                //   "An unexpected error occured. Please try again!"
                // );
                console.log(
                  "Unexpected API error, web app user details doesn't exist"
                );
              }
            });
          }
        });
      })
      .catch((error) => {
        ///
        console.log(error);
        let errorMsg = "";
        switch (error.code) {
          case "auth/invalid-email":
            errorMsg = "Invalid email address format.";
            break;
          case "auth/user-not-found":
            errorMsg = "Invalid user.";
            break;
          case "auth/wrong-password":
            //if user registered in database but not in authentication, go to Passchangepage
            // console.log("you must create firebase auth");
            let ref = Firebase.firestore()
              .collection("Web_App_Users")
              .doc(loginData.email.toLowerCase());
            // console.log("ref ===> ", ref);
            ref.get().then(function (app_user) {
              if (app_user.exists) {
                var password = loginData.password;
                // console.log(password, app_user.data().Password, '==>', PasswordHash.verify(password, app_user.data().Password));
                // if (PasswordHash.verify(password, app_user.data().Password)) {
                if (app_user.data().Activated) {
                  if (app_user.data().OTP_Enabled) {
                    setState({ loading: false });
                    //   inputAlert();
                    console.log("enabled!");
                  } else {
                    Firebase.auth()
                      .createUserWithEmailAndPassword(
                        loginData.email,
                        loginData.password
                      )
                      .then((credential) => {
                        // console.log("Credential ==> ", credential);
                        Firebase.auth().currentUser.updateProfile({
                          displayName: "",
                        });
                      })
                      .catch((error1) => {
                        errorMsg = "";
                        switch (error1.code) {
                          case "auth/email-already-in-use":
                            errorMsg = "This e-mail is already in use.";
                            break;
                          case "auth/invalid-email":
                            errorMsg = "Invalid e-mail address format.";
                            break;
                          case "auth/weak-password":
                            errorMsg = "Password is too weak.";
                            break;
                          case "auth/too-many-requests":
                            errorMsg =
                              "Too many requests. Please try again in a while.";
                            break;
                          default: //errorMsg = "Please check your internet connection."
                            console.log(
                              "An unexpected error occured. Please try again later."
                            );
                            console.log("error1", error1);
                            break;
                        }
                        setState({ loading: false });
                        //   notifyMessage("tc", 3, errorMsg);
                      });
                  }
                }
                // }
              }
            });
            errorMsg = "Invalid email address or password.";
            break;
          case "auth/too-many-requests":
            errorMsg = "Too many requests. Try again in a minute.";
            break;
          default:
            console.log("An unexpected error occured. Please try again later.");
            errorMsg = "An unexpected error occured. Please try again later.";
            break;
        }
        setState({ loading: false });
        // notifyMessage("tc", 3, errorMsg);
      });
  };
 
  const verifyEmail = (value) => {
    var emailRex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(value)) {
      return true;
    }
    return false;
  };
  // function that verifies if a string has a given length or not
  const verifyLength = (value, length) => {
    if (value.length >= length) {
      return true;
    }
    return false;
  };  

  let appVersion = process.env.REACT_APP_VERSION;
  let { registerEmailState, registerPasswordState } = state;

  return (
    <div
      className="wrapper wrapper-full-page"
      //  ref={(ref) => (fullPages = ref)}
    >
      <div className="full-page section-image">
        <>
          {/* <NotificationAlert ref={(ref) => (notificationAlert = ref)} /> */}
        </>
        <div className="login-page">
          {state.alert}
          <Container>
            <Row>
              <Col className="ml-auto mr-auto" lg="7" md="6">
                <Card
                  style={{
                    backgroundColor: "#ffffff00",
                    boxShadow: "0px 0px 0px 0px rgb(0 0 0 / 1%)",
                  }}
                  className="card-login"
                >
                  <CardHeader>
                    <CardHeader>
                      <div className="header text-center">
                        {/* <img src={'/antqueue-animated-logo.gif'} alt={"animated-antqueue-logo"} />  */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <Logo/>
                          {/* <lottie-player
                            src="/antqueue-animated-logo-lottie-data.json"
                            background="transparent"
                            speed="1"
                            style={{ width: "200px", height: "200px" }}
                            loop
                            autoplay
                          ></lottie-player> */}
                        </div>
                      </div>
                      <h3
                        style={{ color: "#fff" }}
                        className="header text-center Margin-top--20"
                      >
                        AntQueue Login
                      </h3>
                    </CardHeader>
                  </CardHeader>
                  <CardBody>
                    <div className="row justify-content-center  gap-2">
                      <div className="col-md-9 d-flex flex-column gap-2">
                        <label style={{ color: "#000" }}>Email Address</label>
                        <InputGroup
                          className={`has-label ${registerEmailState}`}
                        >
                          {/* <InputGroup addonType="prepend">
                            <InputGroupText
                              style={{
                                padding: "10px 10px 10px 10px",
                                backgroundColor: "#000",
                              }}
                            >
                              <i className="nc-icon nc-email-85" />
                            </InputGroupText>
                          </InputGroup> */}
                          <Input
                            placeholder="Email Address"
                            name="email"
                            type="email"
                            onBlur={(e) =>
                              handleChange(e, "registerEmail", "email")
                            }
                            // onKeyDown={(e) => {
                            //   if (e.keyCode === 13) {
                            //     focusElement(refs["password"]);
                            //   }
                            // }}
                          />
                          {state.registerEmailState === "has-danger" ? (
                            <label className="error">
                              Please enter a valid email address.
                            </label>
                          ) : null}
                        </InputGroup>
                        <label style={{ color: "#000" }}>Password</label>
                        <InputGroup
                          className={`has-label ${registerPasswordState}`}
                        >
                          {/* <InputGroup addonType="prepend">
                            <InputGroupText
                              style={{
                                padding: "10px 10px 10px 10px",
                                backgroundColor: "#000",
                              }}
                            >
                              <i className="nc-icon nc-key-25" />
                            </InputGroupText>
                          </InputGroup> */}
                          <Input
                            placeholder="Password"
                            type="password"
                            name="password"
                            // ref="password"
                            autoComplete="off"
                            onChange={(e) =>
                              handleChange(e, "registerPassword", "password")
                            }
                            onKeyDown={(e) => {
                              if (e.keyCode === 13) {
                                handleSignIn();
                              }
                            }}
                          />
                          {state.registerPasswordState === "has-danger" ? (
                            <label className="error">
                              This field is required.
                            </label>
                          ) : null}
                        </InputGroup>

                        <div className="row gap-2">
                          <div className="col-md-5">
                            <Button
                              color="success"
                              onClick={handleSignIn}
                              block
                            >
                              Sign in
                            </Button>
                          </div>
                          <div className="col-md-7">
                            <Button
                              color="primary"
                              onClick={(e) =>
                                props.history.push("/forgot_password")
                              }
                              block
                            >
                              Forgot Password
                            </Button>
                          </div>
                        </div>
                      </div>

                      <span
                        style={{ color: "#000" }}
                        className="login-form-answer"
                      >
                        Are you a new member? Please{" "}
                        <a
                          href="https://app.antqueue.com"
                          target="_blank"
                          // onClick={(e) => {
                          //   e.preventDefault();
                          //   props.history.push("/register");
                          // }}
                        >
                          Register.
                        </a>
                      </span>
                    </div>
                  </CardBody>
                  <CardFooter>
                    <div
                      style={{
                        color: "#fff",
                        fontSize: "8px",
                        marginTop: "25px",
                      }}
                      className="header text-center font-weight-normal text-capitalize"
                    >
                      {"AntQueue v" + appVersion}
                    </div>
                  </CardFooter>
                </Card>
              </Col>
            </Row>
          </Container>
          <div
            className="full-page-background"
            style={{
              //   backgroundImage: `url(${require("../../assets/img/bg/queue_4000x2000_4.jpg")})`,
              backgroundColor: "lightGrey",
            }}
          />
        </div>
      </div>
    </div>
  );
}

// export default withCookies(Login);
export default Login;
