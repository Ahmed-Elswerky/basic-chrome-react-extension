import React, { useEffect, useState } from "react";
import Firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/functions";
import Select from "react-select";
import counterYellow from "../assets/counter-yellow.png";
import counterGreen from "../assets/counter-green.png";
import counterOrange from "../assets/counter-orange.png";
import counterRed from "../assets/counter-red.png";

import {
  Col,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Button,
  Label,
  Form,
  FormGroup,
  Input,
} from "reactstrap";
import config from "../config";
import CounterRun from "./counterRun";

export default function Counters() {
  if (!Firebase.apps.length) {
    Firebase.initializeApp(config);
  }

  const [counterId, setCounterId] = useState(localStorage.getItem("counterId"));

  const [state, setState1] = useState({
    loading: false,
    customer_id: "",
    role: "",
    customer_Id: "",
    counter_list: [],
    main_location_list: [],
    sub_location_list: [],
    services_list: [],
    selected_main_location: null,
    selected_sub_location: null,
    alert: null,
    fingerprint: 0,
    locked: false,
    functionsBaseURL: "",
  });
  const setState = (e) => {
    setState1((c) => ({ ...c, ...e }));
  };
  useEffect(() => {
    var customer_id = JSON.parse(localStorage.getItem("auth_info"))?.customer_id;
    
    // console.log("auth().currentUser==>", Firebase.auth().currentUser);
    
    
    const timeOutData = () =>
      setTimeout(() => {
        console.log("customer_id", customer_id);
        if (customer_id) loadMainLocations();
        else {
          customer_id = JSON.parse(
            localStorage.getItem("auth_info")
          )?.customer_id;
          setState({ customer_id: customer_id });

          timeOutData();
        }
      }, 150);

    timeOutData()
 
    setState({ functionsBaseURL: config.baseURL });
    return () => {
      // clearTimeout(interval1);
      // clearTimeout(interval2);
      // clearTimeout(interval3);
    };
  }, []);

  function loadMainLocations() {
    let main_locations = [];
    // console.log(Firebase.auth().currentUser);
    let customer_id = JSON.parse(localStorage.getItem("auth_info"))?.customer_id;
    let email = JSON.parse(localStorage.getItem("auth_info"))?.email;
    setState({ customer_id: customer_id });
    Firebase.firestore()
      .collection("Customers")
      .doc(customer_id)
      .get()
      .then(
        (e) => {
          if (!e.empty) setState({ customer_name: e.data().Name });
        },
        (err) => {
          console.log("Customer err==> ", customer_id, err);
        }
      );
    let role = JSON.parse(localStorage.getItem("auth_info"))?.role;
    setState({ role: role });

    // ---------- Load Location List ---------- //
    Firebase.firestore()
      .collection("Main_Locations")
      .where("Customer_ID", "==", customer_id)
      .get()
      .then(function (response) {
        response.docs.forEach(function (doc) {
          main_locations.push({ label: doc.data().Name, value: doc.id });
        });

        setState({ main_location_list: main_locations });
        if (main_locations.length > 0) {
          setState({ selected_main_location: main_locations[0] });
          loadSubLocationByMain(main_locations[0].value);
        } else {
          setState({ loading: false });
        }
      })
      .catch(function (err) {
        setState({ loading: false });
        // notifyMessage("tc", 3, "Network error!");
        console.log("loadMainLocations NetworkError1==>", err);
      });
  }
  function loadSubLocationByMain(main_id) {
    setState({ loading: true });
    setState({ selected_sub_location: null });
    let sub_locations = [];
    let accessible_locations = [];
    let email = JSON.parse(localStorage.getItem("auth_info"))?.email;

    Firebase.firestore()
      .collection("Web_App_Users")
      .doc(email)
      .get()
      .then(function (app_info) {
        if (app_info.exists) {
          accessible_locations = app_info.data().Accessible_Locations;
          //console.log("accessible locations:",accessible_locations);
        }
      })
      .catch(function (err) {
        setState({ loading: false });
        // notifyMessage("tc", 3, "Network error!");
        console.log("loadSubLocationByMain NetworkError2==>", err);
      });
    let customer_id = JSON.parse(localStorage.getItem("auth_info"))?.customer_id;

    Firebase.firestore()
      .collection("Sub_Locations")
      .where("Customer_ID", "==", customer_id)
      .where("Main_Location_ID", "==", main_id)
      .get()
      .then(function (response) {
        response.docs.forEach(function (doc) {
          if (accessible_locations.includes(doc.id)) {
            sub_locations.push({
              label: doc.data().Name,
              value: doc.id,
              image_url: doc.data().Icon,
              address: doc.data().Address,
            });
          }
        });
        setState({ sub_location_list: sub_locations });
        if (sub_locations.length > 0) {
          let first_one = sub_locations[0];
          setState({ selected_sub_location: first_one });
          setState({ location_image_url: first_one.image_url });
          setState({ location_name: first_one.label });
          setState({ location_address: first_one.address });
          loadCounterListBySub(sub_locations[0].value);
          // loadServicesBySub(sub_locations[0].value);
        } else {
          setState({ loading: false });
          // notifyMessage(
          //   "tc",
          //   3,
          //   `There are no sublocations attached to this mainlocation or you may not have access to it. Please check with your supervisor.`
          // );
        }
      })
      .catch(function (err) {
        setState({ loading: false });
        // notifyMessage("tc", 3, "Network error!");
        console.log("loadSubLocationByMain NetworkError3==>", err);
      });
  }
  function loadCounterListBySub(sub_id) {
    // console.log("loading counters...");
    
    let customer_id = JSON.parse(localStorage.getItem("auth_info"))?.customer_id;

    Firebase.firestore()
      .collection("Counters")
      .where("Customer_ID", "==", customer_id)
      .where("Sub_Location_ID", "==", sub_id)
      .orderBy("Counter_Name", "asc")
      .onSnapshot(
        function (response) {
          let counters = [],
            lok = false,
            one = [];
          response.docs.forEach(function (counter) {
            let fing = 0;
            if (counter.data().Lock_To_Specific_Computer != undefined)
              if (counter.data().Lock_To_Specific_Computer.length > 0) {
                fing = counter.data().Lock_To_Specific_Computer;
                if (
                  state.fingerprint == counter.data().Lock_To_Specific_Computer
                ) {
                  lok = true;
                }
              }

            one = {
              id: counter.id,
              fingerprint: fing,
              created_date: counter.data().Created_Date,
              name: counter.data().Counter_Name,
              state: counter.data().Counter_State,
              user: counter.data().Logged_In_User_Name,
              tok:
                counter.data().Current_Token !== undefined
                  ? counter.data().Current_Token.number
                  : "",
              logged: counter.data().Logged_In_User_ID,
            };
            counters.push(one);
          });

          let sorted = counters;
          setState({ counter_list: sorted, locked: lok, loading: false });
        },
        (error) => {
          console.log("loading Counters error!", error);
          setState({ loading: false });
        }
      );
  }

  function handleRun(id) { 
    localStorage.setItem('counterId',id)
    setCounterId(id)
  }

  function getCounters() {
    let _this = this,
      lockto = false,
      counterlock = false,
      final_lock;
    var email = JSON.parse(localStorage.getItem("auth_info"))?.email;

    const counter_list = [];
    return state.counter_list.map((prop, index) => {
      let _this = this,
        lockto = false,
        counterlock = false,
        final_lock;
      var email = JSON.parse(localStorage.getItem("auth_info"))?.email;
      lockto = false;
      counterlock = false;
      if (prop.fingerprint != 0) {
        if (prop.fingerprint == state.fingerprint) lockto = true;
        else counterlock = true;
      }
      final_lock = state.locked
        ? lockto
          ? false
          : true
        : counterlock
        ? true
        : false;
      if (
        (prop.state == "Open" || prop.state == "Occupied") &&
        prop.Logged_In_User_ID != state.email
      ) {
        final_lock = true;
      }
      counter_list.push({
        title: `rows${index}`,
      });
      if (state.counter_list.length == index)
        state = {
          counter_list,
        };
      return (
        <div key={index}>
          <hr />
          <Row className="col-12">
            <Col md="4" className="text-center">
              <Row className="justify-content-center">
                <Col md="8" sm="8">
                  <button
                    disabled={final_lock}
                    className="btn btn-block btn-info"
                    onClick={(e) => handleRun(prop.id)}
                  >
                    Run
                  </button>
                </Col>
              </Row>
            </Col>
            <Col md="4" className="d-flex flex-column justify-content-center">
              <Row className="justify-content-center text-center">
                <Col md="8" sm="8">
                  <img
                    className="width-5 mx-auto"
                    src={
                      prop.state == "Open"
                        ? counterGreen
                        : prop.state == "Occupied"
                        ? counterYellow
                        : prop.state == "On Break"
                        ? counterOrange
                        : prop.state == "Temporarily Closed"
                        ? counterRed
                        : counterRed
                    }
                    alt="..."
                  />
                </Col>
              </Row>
              <Row className="text-center font-weight-bold justify-content-center">
                <Col md="8" sm="8">
                  <h6 className="col-12 text-center font-weight-bold">
                    {prop.name}
                  </h6>
                </Col>
              </Row>
            </Col>
            <Col md="4" className="d-flex flex-column justify-content-center">
              <Row className="px-0 text left font-weight-bold">
                <Col md="12" sm="12">
                  <h6 className="col-12 px-0 text left font-weight-bold">
                    Last Logged-On User:
                  </h6>
                  <h6 className="col-12 px-0 text left font-weight-normal">
                    {prop.user}
                  </h6>
                </Col>
              </Row>
              <Row className="px-0 text left font-weight-bold">
                <Col md="12" sm="12">
                  <h6 className="col-12 px-0 text left font-weight-bold">
                    Last token:
                  </h6>
                  <h6 className="col-12 px-0 text left font-weight-normal">
                    {prop.tok}
                  </h6>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      );
    });
  }
  function onChangeMain(e) {
    setState({ selected_main_location: e });
    loadSubLocationByMain(e.value);
  }
  function onChangeSub(e) {
    setState({ selected_sub_location: e });
    setState({ location_image_url: e.image_url });
    setState({ location_name: e.label });
    setState({ location_address: e.address });
    loadCounterListBySub(e.value);
    // loadServicesBySub(e.value);
  }

  if(counterId?.length>0)
  return <CounterRun setCounterId={setCounterId} counter_id={counterId}/>

  return (
    <>
      {/* <LoadingOverlay
          active={state.loading}
          spinner
          text="Loading"
          className="content"
        > */}
      {/* <NotificationAlert ref={(ref) => (notificationAlert = ref)} /> */}
      {state.alert}
      <Row>
        <Col md="12">
          <Card>
            <CardHeader>
              <CardTitle tag="h4">Counters</CardTitle>
            </CardHeader>
            <CardBody>
              <Col className="ml-auto mr-auto" xl="8" lg="12" md="12">
                <Form>
                  <Row>
                    <Col lg="8" xs="12">
                      <FormGroup>
                        <Label>Main Location</Label>
                        <Select
                          className="react-select info select-location"
                          classNamePrefix="react-select"
                          placeholder="Select Main Location"
                          name="selectMainLocation"
                          value={state.selected_main_location}
                          onChange={(e) => onChangeMain(e)}
                          options={state.main_location_list}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="8" xs="12">
                      <FormGroup>
                        <Label>Sub Location</Label>
                        <Select
                          className="react-select info select-location"
                          classNamePrefix="react-select"
                          placeholder="Select Sub Location"
                          name="selectSubLocation"
                          value={state.selected_sub_location}
                          onChange={(e) => onChangeSub(e)}
                          options={state.sub_location_list}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <hr />
                </Form>
                <Row>
                  <Col xl="12" lg="12" md="12">
                    {getCounters()}
                  </Col>
                </Row>
              </Col>
            </CardBody>
          </Card>
        </Col>
      </Row>
      {/* </LoadingOverlay> */}
    </>
  );
}
