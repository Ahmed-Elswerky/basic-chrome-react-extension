import React from "react";
import NotificationAlert from "react-notification-alert";
import Firebase from "firebase";
import LoadingOverlay from "react-loading-overlay";
import Select from "react-select";
import ReactBSAlert from "react-bootstrap-sweetalert";
import counterYellow from "../../../assets/img/counter-yellow.png";
import counterGreen from "../../../assets/img/counter-green.png";
import counterOrange from "../../../assets/img/counter-orange.png";
import counterRed from "../../../assets/img/counter-red.png";
import config from "../../../config";
import Fingerprint2 from "fingerprintjs2";

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

var options1 = {
  excludes: {
    userAgent: true,
    doNotTrack: true,
    plugins: true,
    canvas: true,
    webgl: true,
    adBlock: true,
    fonts: true,
    audio: true,
  },
};
class Counters extends React.Component {
  constructor(props) {
    super(props);
    if (!Firebase.apps.length) {
      Firebase.initializeApp(config);
    }

    this.state = {
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
    };

    // this.functions = null;                                              //functions emulator
    // this.fbStore = null;                                                //functions emulator
  }

  // initializeFirebase = () => {                                            //functions emulator
  // if (!this.functions) {                                              //functions emulator
  // this.functions = Firebase.functions();                          //functions emulator
  // this.functions.useFunctionsEmulator('http://localhost:5001');   //functions emulator
  // this.fbStore = Firebase.firestore();                            //functions emulator
  // }                                                                   //functions emulator
  // }                                                                       //functions emulator

  componentDidMount() {
    // this.initializeFirebase();                                          //functions emulator
    let _this = this;
    _this.interval1 = setTimeout(function () {
      Fingerprint2.get(options1, (e) => {
        console.log(e);
      });
      Fingerprint2.getV18(options1, function (res, components) {
        _this.setState({ fingerprint: res });
        console.log(res + "    5645644564");
      });
    }, 500);
    var customer_id = JSON.parse(localStorage.getItem("auth_info")).customer_id;
    _this.setState({ customer_id: customer_id });

    // console.log("auth().currentUser==>", Firebase.auth().currentUser);
    _this.loadMainLocations();
    _this.setState({ functionsBaseURL: config.baseURL });
  }
  componentWillUnmount() {
    /* Dispose the timeouts */
    clearTimeout(this.interval1);
    clearTimeout(this.interval2);
    clearTimeout(this.interval3);
  }
  loadMainLocations() {
    let _this = this;
    let main_locations = [];
    // console.log(Firebase.auth().currentUser);
    let customer_id = JSON.parse(localStorage.getItem("auth_info")).customer_id;
    let email = JSON.parse(localStorage.getItem("auth_info")).email;
    _this.setState({ customer_id: customer_id });
    Firebase.firestore()
      .collection("Customers")
      .doc(customer_id)
      .get()
      .then(
        (e) => {
          if (!e.empty) this.setState({ customer_name: e.data().Name });
        },
        (err) => {
          console.log("Customer err==> ", customer_id, err);
        }
      );
    let role = JSON.parse(localStorage.getItem("auth_info")).role;
    _this.setState({ role: role });

    // ---------- Load Location List ---------- //
    Firebase.firestore()
      .collection("Main_Locations")
      .where("Customer_ID", "==", customer_id)
      .get()
      .then(function (response) {
        response.docs.forEach(function (doc) {
          main_locations.push({ label: doc.data().Name, value: doc.id });
        });

        _this.setState({ main_location_list: main_locations });
        if (main_locations.length > 0) {
          _this.setState({ selected_main_location: main_locations[0] });
          _this.loadSubLocationByMain(main_locations[0].value);
        } else {
          _this.setState({ loading: false });
        }
      })
      .catch(function (err) {
        _this.setState({ loading: false });
        _this.notifyMessage("tc", 3, "Network error!");
        console.log("loadMainLocations NetworkError1==>", err);
      });
  }
  // async loadMainLocations2() {
  //     let _this = this;
  //     let main_locations = [];
  //     let customer_id = JSON.parse(localStorage.getItem('auth_info')).customer_id;
  //     let email = JSON.parse(localStorage.getItem('auth_info')).email;
  //     _this.setState({customer_id: customer_id});
  //     let data = await Firebase.firestore().collection('Customers').doc(customer_id).get();
  //     if (!data.empty) this.setState({customer_name: data.data().Name});
  //     // Firebase.firestore().collection('Customers').doc(customer_id).get().then(e=>{
  //     //     if(!e.empty)
  //     //         this.setState({customer_name: e.data().Name});

  //     // })
  //     let role = JSON.parse(localStorage.getItem('auth_info')).role;
  //     this.setState({role: role});

  //     // ---------- Load Location List ---------- //
  //     let response = await Firebase.firestore().collection('Main_Locations').where('Customer_ID', '==', customer_id).get();
  //     response.forEach(doc => {
  //         main_locations.push({label: doc.data().Name, value: doc.id});
  //     })
  //     this.setState({
  //         main_location_list: main_locations
  //     })
  //     if (main_locations.length) {
  //         this.setState({selected_main_location: main_locations[0]});
  //         this.loadSubLocationByMain(main_locations[0].value);
  //     } else {
  //         this.setState({loading: false});
  //     }
  // }
  loadSubLocationByMain(main_id) {
    let _this = this;
    _this.setState({ loading: true });
    _this.setState({ selected_sub_location: null });
    let sub_locations = [];
    let accessible_locations = [];
    let email = JSON.parse(localStorage.getItem("auth_info")).email;

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
        _this.setState({ loading: false });
        _this.notifyMessage("tc", 3, "Network error!");
        console.log("loadSubLocationByMain NetworkError2==>", err);
      });
    let customer_id = JSON.parse(localStorage.getItem("auth_info")).customer_id;
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
        // console.log('Sublocations==>', sub_locations);
        _this.setState({ sub_location_list: sub_locations });
        if (sub_locations.length > 0) {
          let first_one = sub_locations[0];
          _this.setState({ selected_sub_location: first_one });
          _this.setState({ location_image_url: first_one.image_url });
          _this.setState({ location_name: first_one.label });
          _this.setState({ location_address: first_one.address });
          _this.loadCounterListBySub(sub_locations[0].value);
          // _this.loadServicesBySub(sub_locations[0].value);
        } else {
          _this.setState({ loading: false });
          _this.notifyMessage(
            "tc",
            3,
            `There are no sublocations attached to this mainlocation or you may not have access to it. Please check with your supervisor.`
          );
        }
      })
      .catch(function (err) {
        _this.setState({ loading: false });
        _this.notifyMessage("tc", 3, "Network error!");
        console.log("loadSubLocationByMain NetworkError3==>", err);
      });
  }
  loadCounterListBySub(sub_id) {
    // console.log("loading counters...");
    let _this = this;
    let customer_id = JSON.parse(localStorage.getItem("auth_info")).customer_id;
    // _this.setState({loading: true});
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
                  _this.state.fingerprint ==
                  counter.data().Lock_To_Specific_Computer
                ) {
                  lok = true;
                }
              }

            // counter.data().Serving_Services.forEach(e => {
            //     var inc = false
            //     _this.state.services_list.forEach(b => { if (Object.values(b).includes(e)) inc = true })
            //     if (!inc)
            //         Firebase.firestore().collection('Services').doc(e).get().then(d => {
            //             var emp = true, dd = new Date(), total = 0, pending = 0, served = 0
            //             _this.state.services_list.forEach(b => {
            //                 if (b.id == e) {
            //                     emp = false
            //                 }
            //             })
            //             emp ? _this.state.services_list.push({ 'sublocation_ID': sub_id, 'counter_ID': counter.id, 'service_ID': e, 'services_name': d.data().Name, 'last_called_num': d.data().Last_Called_Number, 'total': total, 'pending': pending, 'served': served }) : emp = false;

            //         })
            // })

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
              // state: counter.data().Counter_State,
              logged: counter.data().Logged_In_User_ID,
              //services_data: _this.state.services_list
            };
            counters.push(one);
          });

          let sorted = counters;
          _this.setState({ counter_list: sorted, locked: lok, loading: false });
          // console.log("services_list_here_!", _this.state.services_list);
        },
        (error) => {
          console.log("loading Counters error!", error);
          _this.setState({ loading: false });
        }
      );
    //.then(error => {

    //})
  }

  handleAdd() {
    let _this = this;
    _this.setState({ loading: true });
    Firebase.functions()
      .httpsCallable("getPaymentRestrictionsBasedOnSelectedPackage")({
        sub_location_id: _this.state.selected_sub_location.value,
        type: "COUNTERS",
        antqueue_customer_id: _this.state.customer_id,
      })
      .then(function (result) {
        const res = result.data;
        //console.log('validateItemCount', {result});
        if (res.status === "ok") {
          var limitExceeded = res.data.countExceedsLimit;
          console.log("validateItemCount>>> countExceedsLimit", limitExceeded);
          _this.setState({ loading: false });
          // return limitExceeded;
          if (limitExceeded === true) {
            _this.notifyMessage(
              "tc",
              3,
              "Sorry, the selected package for current sub location does not allow any more Counters to be added."
            );
          } else {
            _this.props.history.push("/counter/add");
          }
        }
      })
      .catch((error) => {
        _this.setState({ loading: false });
        console.log("validateItemCount", { error });
        return error;
      });
  }

  handleRun(id) {
    var _this = this;
    Firebase.firestore()
      .collection("Counters")
      .doc(id)
      .get()
      .then((e) => {
        var email = JSON.parse(localStorage.getItem("auth_info")).email;
        var username = JSON.parse(localStorage.getItem("auth_info")).username;
        // console.log('current user email',email, 'current user username',username,'existing Logged_In_User_ID', e.data().Logged_In_User_ID,'existing Counter_State', e.data().Counter_State);
        if (e.data().Counter_State === "Closed") {
          Firebase.firestore().collection("Counters").doc(id).update({
            Counter_State: "Closed",
            Logged_In_User_ID: email,
            Logged_In_User_Name: username,
          });
          localStorage.setItem("running_counter", id);
          this.props.history.push("/counter/run/" + id);
        } else {
          if (e.data().Logged_In_User_ID === email) {
            Firebase.firestore().collection("Counters").doc(id).update({
              Counter_State: "Closed",
            }); /*close existing counter tabs running for same user*/
            this.interval2 = setTimeout(function () {
              // Firebase.firestore().collection('Counters').doc(id).update({Counter_State:'Update'});
              localStorage.setItem("running_counter", id);
              _this.props.history.push("/counter/run/" + id);
            }, 1200);
          } else {
            let lastCalledUnixTimeStamp =
              e.data().Last_Called_Date_Time_Unix_Timestamp;
            let now = new Date(),
              currentUnixTimeStamp = now.getTime(),
              currentUnixTimeStampString = currentUnixTimeStamp.toString(),
              currentUnixTimeStampFixed = currentUnixTimeStampString.substring(
                0,
                10
              );
            let timeDifferenceSeconds =
              currentUnixTimeStampFixed - lastCalledUnixTimeStamp;
            let breakCheck1 = false;

            if (timeDifferenceSeconds >= 3600) {
              /*close existing counter tabs running for different user if Last Called time is greater than 1 hour*/
              console.log(
                "tDiff ",
                "lastCalledUnixTimeStamp:" +
                  lastCalledUnixTimeStamp +
                  "_currentUnixTimeStamp:" +
                  currentUnixTimeStampFixed +
                  "_timeDifference:" +
                  timeDifferenceSeconds
              );

              Firebase.firestore()
                .collection("Counters")
                .doc(id)
                .update({ Counter_State: "Closed" });
              this.interval3 = setTimeout(function () {
                // Firebase.firestore().collection('Counters').doc(id).update({Counter_State:'Update'});
                localStorage.setItem("running_counter", id);
                _this.props.history.push("/counter/run/" + id);
              }, 1200);
              breakCheck1 = true;
            }

            if (breakCheck1 == false) {
              //this.notifyMessage("tc", 3, "This counter is already in use by another user. If you want to use this counter, please close the counter. If you do not have the rights to close the counter, please contact your supervisor.");
              this.notifyMessage(
                "tc",
                3,
                "This counter is already in use by another user. Supervisory users and above can close the counter. If counter is not in use for an hour since last use, it will be closed automatically."
              );
            }
          }
          this.setState({ loading: false });
        }
      });
  }
  handleEdit(id) {
    this.props.history.push("/counter/edit/" + id);
  }
  handleClose(id) {
    let _this = this;
    Firebase.firestore().collection("Counters").doc(id).update({
      Counter_State: "Closed",
      Close_Admin_Name: _this.state.customer_name,
    });
  }
  // servicesList(){

  // }
  getCounters() {
    let _this = this,
      lockto = false,
      counterlock = false,
      final_lock;
    var email = JSON.parse(localStorage.getItem("auth_info")).email;

    const counter_list = [];
    return this.state.counter_list.map((prop, index) => {
      let _this = this,
        lockto = false,
        counterlock = false,
        final_lock;
      var email = JSON.parse(localStorage.getItem("auth_info")).email;
      lockto = false;
      counterlock = false;
      if (prop.fingerprint != 0) {
        if (prop.fingerprint == _this.state.fingerprint) lockto = true;
        else counterlock = true;
      }
      final_lock = _this.state.locked
        ? lockto
          ? false
          : true
        : counterlock
        ? true
        : false;
      if (
        (prop.state == "Open" || prop.state == "Occupied") &&
        prop.Logged_In_User_ID != _this.state.email
      ) {
        final_lock = true;
      }
      counter_list.push({
        title: `rows${index}`,
      });
      if (this.state.counter_list.length == index)
        this.state = {
          counter_list,
        };
      return (
        <div key={index}>
          <hr />
          <Row className="col-12">
            <Col md="4" className="text-center">
              <Row>
                <Col md="8" sm="8">
                  <button
                    disabled={final_lock}
                    className="btn btn-block btn-info"
                    onClick={(e) => _this.handleRun(prop.id)}
                  >
                    Run
                  </button>
                </Col>
              </Row>
              <Row>
                <Col
                  md="8"
                  sm="8"
                  hidden={
                    !(
                      _this.state.role === "Site_Admin" ||
                      _this.state.role === "System_Admin" ||
                      _this.state.role === "Location_Admin" ||
                      _this.state.role === "Location_Super"
                    )
                  }
                >
                  <Button
                    color="warning"
                    onClick={(e) => _this.handleEdit(prop.id)}
                    block
                  >
                    Edit
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col
                  md="8"
                  sm="8"
                  hidden={
                    !(
                      _this.state.role === "Site_Admin" ||
                      _this.state.role === "System_Admin" ||
                      _this.state.role === "Location_Admin" ||
                      _this.state.role === "Location_Super"
                    )
                  }
                >
                  <Button
                    color="danger"
                    onClick={(e) =>
                      prop.state != "Closed" ? _this.handleClose(prop.id) : ""
                    }
                    block
                  >
                    Close
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col
                  md="8"
                  sm="8"
                  hidden={
                    !(
                      _this.state.role === "Site_Admin" ||
                      _this.state.role === "System_Admin" ||
                      _this.state.role === "Location_Admin" ||
                      _this.state.role === "Location_Super"
                    )
                  }
                >
                  <Button
                    color="youtube"
                    onClick={(e) => _this.warningWithConfirmMessage(prop)}
                    block
                  >
                    Delete
                  </Button>
                </Col>
              </Row>
            </Col>
            <Col md="4" className="d-flex flex-column justify-content-center">
              <Row className=" text-center">
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
              <Row className="text-center font-weight-bold">
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
              {/* <Row className="px-0 text left font-weight-normal">
                                <Col md="12" sm="12">
                                    <div className="left-margin-10 top-margin-10" style={{fontSize:'0.7rem'}}>
                                        <Row>
                                            <Col md='12' className='px-0 text-left'><details>
                                                <summary>More info</summary>
                                                <br/>
                                                <br/>
                                                <a>Last generated token in : </a>
                                                <br/>
                                                <span>{"item.end_number"}</span>
                                                <br/>
                                                <br/>
                                                <a>Last printed token : </a>
                                                <span>{"item.end_number"}</span>
                                                <br/>
                                                <br/>
                                                <a>Last called counter : </a>
                                                <span>{"item.end_number"}</span>
                                            </details></Col>
                                        </Row>
                                    </div>
                                </Col>
                            </Row> */}
            </Col>
          </Row>
        </div>
      );
    });
  }
  // loadServicesBySub(sub_id) {
  //     let _this = this, i = 0;
  //     _this.setState({ loading: true });
  //     let services = [];
  //     Firebase.firestore().collection('Services').where('Customer_ID', '==', customer_id).where('Sub_Location_ID', '==', sub_id).onSnapshot(function (response) {
  //         i = 0
  //         response.docs.forEach(function (doc) {
  //             i++
  //             let one = {
  //                 id: doc.id,
  //                 name: doc.data().Name,
  //                 icon: doc.data().Icon,
  //                 start_number: doc.data().Start_Number,
  //                 end_number: doc.data().End_Number,
  //                 details: doc.data().Details,
  //                 priority: doc.data().Priority,
  //                 list_order: doc.data().List_Order,
  //                 curr: doc.data().Last_Called_Number,
  //                 pend: doc.data().Waiting_In_Queue,
  //                 serv: doc.data().Served_Tokens,
  //                 last_gen_t: doc.data().Last_Generated_Token_Date_Time.seconds == undefined ? doc.data().Last_Generated_Token_Date_Time : new Date(doc.data().Last_Generated_Token_Date_Time.seconds * 1000).toDateString(),
  //                 // last_gen_t: '',
  //                 last_gen: doc.data().Last_Generated_Token,
  //                 last_call: doc.data().Last_Called_Number,
  //                 last_call_c: doc.data().Last_Called_Counter,
  //                 updated_date: doc.data().Updated_Date,
  //                 order: i
  //             };
  //             var inc = false
  //             services.forEach(b => {
  //                 if (b.id == one.id) {
  //                     b.id = doc.id
  //                     b.name = doc.data().Name
  //                     b.icon = doc.data().Icon
  //                     b.start_number = doc.data().Start_Number
  //                     b.end_number = doc.data().End_Number
  //                     b.details = doc.data().Details
  //                     b.priority = doc.data().Priority
  //                     b.list_order = doc.data().List_Order
  //                     b.curr = doc.data().Last_Called_Number
  //                     b.pend = doc.data().Pending_Count
  //                     b.serv = doc.data().Served_Tokens
  //                     b.last_gen_t = doc.data().Last_Generated_Token_Date_Time.seconds == undefined ? doc.data().Last_Generated_Token_Date_Time : new Date(doc.data().Last_Generated_Token_Date_Time.seconds * 1000).toDateString()
  //                     b.last_gen = doc.data().Last_Generated_Token
  //                     b.last_call = doc.data().Last_Called_Number
  //                     b.last_call_c = doc.data().Last_Called_Counter
  //                     b.updated_date = doc.data().Updated_Date
  //                     inc = true
  //                 }
  //             })
  //             if (!inc) services.push(one)
  //         });

  //     let sorted = services.sort(function(a,b){
  //         if (a.list_order === b.list_order) {
  //             let x = a.updated_date > b.updated_date? -1:1;
  //             return x;
  //         } else {
  //             let x = a.list_order < b.list_order? -1:1;
  //             return x;
  //         }
  //     });
  //     _this.setState({data: sorted});
  //     _this.setState({loading: false});
  //     console.log("services__::", sorted);
  // })

  // }
  notifyMessage = (place, color, text) => {
    var type;
    switch (color) {
      case 1:
        type = "primary";
        break;
      case 2:
        type = "success";
        break;
      case 3:
        type = "danger";
        break;
      case 4:
        type = "warning";
        break;
      case 5:
        type = "info";
        break;
      default:
        break;
    }
    var options = {};
    options = {
      place: place,
      message: (
        <div className="text-md-center">
          <div>
            <b>{text}</b>
          </div>
        </div>
      ),
      type: type,
      icon: "now-ui-icons ui-1_bell-53",
      autoDismiss: 3,
    };
    if (options !== null) {
      this.notificationAlert.notificationAlert(options);
    }
  };
  onChangeMain(e) {
    this.setState({ selected_main_location: e });
    this.loadSubLocationByMain(e.value);
  }
  onChangeSub(e) {
    this.setState({ selected_sub_location: e });
    this.setState({ location_image_url: e.image_url });
    this.setState({ location_name: e.label });
    this.setState({ location_address: e.address });
    this.loadCounterListBySub(e.value);
    // this.loadServicesBySub(e.value);
  }
  deleteItem(object) {
    var _this = this;
    _this.setState({ loading: true });
    Firebase.firestore()
      .collection("Counters")
      .doc(object.id)
      .delete()
      .then(function (res) {
        _this.setState({ loading: false });
        _this.successDelete();
      })
      .catch(function (err) {
        _this.setState({ loading: false });
        _this.notifyMessage("tc", 3, "Network Error.");
        console.log("deleteItem NetworkError4==>", err);
      });
  }
  warningWithConfirmMessage = (object) => {
    this.setState({
      alert: (
        <ReactBSAlert
          warning
          style={{ display: "block", marginTop: "-100px" }}
          title="Are you sure?"
          onConfirm={() => this.deleteItem(object)}
          onCancel={() => this.hideAlert()}
          confirmBtnBsStyle="info"
          cancelBtnBsStyle="danger"
          confirmBtnText="Yes, delete it!"
          cancelBtnText="Cancel"
          showCancel
        ></ReactBSAlert>
      ),
    });
  };
  successDelete = () => {
    this.setState({
      alert: (
        <ReactBSAlert
          success
          style={{ display: "block", marginTop: "-100px" }}
          title="Deleted!"
          onConfirm={() => this.confirmDelete()}
          onCancel={() => this.confirmDelete()}
          confirmBtnBsStyle="info"
        ></ReactBSAlert>
      ),
    });
  };
  confirmDelete = () => {
    this.setState({
      alert: null,
    });

    this.loadCounterListBySub(this.state.selected_sub_location.value);
  };
  hideAlert = () => {
    this.setState({
      alert: null,
    });
  };
  notifyMessage = (place, color, text) => {
    var type;
    switch (color) {
      case 1:
        type = "primary";
        break;
      case 2:
        type = "success";
        break;
      case 3:
        type = "danger";
        break;
      case 4:
        type = "warning";
        break;
      case 5:
        type = "info";
        break;
      default:
        break;
    }

    var options = {};
    options = {
      place: place,
      message: (
        <div className="text-md-center">
          <div>
            <b>{text}</b>
          </div>
        </div>
      ),
      type: type,
      icon: "now-ui-icons ui-1_bell-53",
      autoDismiss: 3,
    };
    if (options != null) {
      this.notificationAlert.notificationAlert(options);
    }
  };
  render() {
    var ok = true;
    if (
      this.state.role == "Counter_Display_User" ||
      this.state.role == "Main_Display_User" ||
      this.state.role == "Dispenser_User" ||
      this.state.role == "Kiosk_User" ||
      this.state.role == "Billing_Admin"
    )
      ok = false;
    return (
      <>
        <LoadingOverlay
          active={this.state.loading}
          spinner
          text="Loading"
          className="content"
        >
          <NotificationAlert ref={(ref) => (this.notificationAlert = ref)} />
          {this.state.alert}
          <Row>
            <Col md="12">
              {ok ? (
                <Card>
                  <CardHeader>
                    <CardTitle tag="h4">Counters</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <Col className="ml-auto mr-auto" xl="8" lg="12" md="12">
                      <Row>
                        {(this.state.role != "Counter_Display_User" &&
                          this.state.role != "Counter_Super" &&
                          this.state.role != "Main_Display_User" &&
                          this.state.role != "Dispenser_User" &&
                          this.state.role != "Kiosk_User" &&
                          this.state.role != "Billing_Admin" &&
                          this.state.role != "Counter_User")? (
                          <Col xl="4" lg="6" md="6" sm="6">
                            <Button
                              color="success"
                              onClick={(e) => this.handleAdd(e)}
                              block
                            >
                              Add Counter
                            </Button>
                          </Col>
                        ) : (
                          ""
                        )}
                      </Row>
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
                                value={this.state.selected_main_location}
                                onChange={(e) => this.onChangeMain(e)}
                                options={this.state.main_location_list}
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
                                value={this.state.selected_sub_location}
                                onChange={(e) => this.onChangeSub(e)}
                                options={this.state.sub_location_list}
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                        <hr />
                      </Form>
                      <Row>
                        <Col xl="12" lg="12" md="12">
                          {this.getCounters()}
                        </Col>
                      </Row>
                    </Col>
                  </CardBody>
                </Card>
              ) : null}
            </Col>
          </Row>
        </LoadingOverlay>
      </>
    );
  }
}

export default Counters;
