import React, {
  useEffect,
  useState,
  useReducer,
  useRef /*, useLayoutEffect*/,
} from "react";
import Firebase from "firebase";
//import Select from "react-select";
import ReactBSAlert from "react-bootstrap-sweetalert";
import NotificationAlert from "react-notification-alert";
import CreatableSelect from "react-select/creatable";
import LoadingOverlay from "react-loading-overlay";
import Switch from "react-bootstrap-switch";
import moment from "moment-timezone";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
//import styled from "styled-components";
import ReactTable from "react-table-6";
//import getmac from "getmac";
import {
  Button,
  Label,
  Modal,
  Form,
  FormGroup,
  //InputGroup,
  Row,
  Col,
  Input,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  ModalHeader,
} from "reactstrap";
import config from "../../../config";

import Fingerprint2 from "fingerprintjs2";
import ServiceRequests from "./ServiceRequests";
import packageJson from "../../../../package.json";
//import ReactToPrint from "react-to-print";
import { useReactToPrint } from "react-to-print";
import TokenModal from "./TokenModal.jsx"; //TESTING_ONLY
import SubTokens from "./SubTokens.jsx"; //TESTING_ONLY
import ServiceModalBtn from "components/counterRun/serviceModal";
import "ka-table/style.css";
import { kaReducer, Table as KaTable } from "ka-table";

import {
  DataType,
  PagingPosition,
  SortingMode,
  FilteringMode,
  SortDirection,
} from "ka-table/enums";
import { CSVLink } from "react-csv";
import { kaPropsUtils } from "ka-table/utils";

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

// const Styles = styled.div`
//   padding: 1rem;

//   table {
//     border-spacing: 0;
//     border: 1px solid black;

//     tr {
//       :last-child {
//         td {
//           border-bottom: 0;
//         }
//       }
//     }

//     th,
//     td {
//       margin: 0;
//       padding: 0.5rem;
//       border-bottom: 1px solid black;
//       border-right: 1px solid black;

//       :last-child {
//         border-right: 0;
//       }
//     }
//   }
// `;

/* Common TimeZone related functions used by CounterRun page */
function calcTime(timeZone) {
  var hhmm = moment(new Date()).tz(timeZone).format("HH:mm");
  return hhmm;
}

// function calcTime(offset) {
//     var d = new Date(); var utc = d.getTime() + d.getTimezoneOffset() * 60000; var nd = new Date(utc + 3600000 * offset);
//     return nd.getHours() + ":" + nd.getMinutes();
// }
// function calcTimestamp() {
//     var now = new Date(); var currTimestamp = Math.floor(now.getTime());
//     return currTimestamp;
// }
// function calcTimestamp(offset) {
//     var d = new Date(); var utc = d.getTime() + d.getTimezoneOffset() * 60000; var nd = new Date(utc + 3600000 * offset);
//     return nd.getTime();
// }
// function calcTimeday(offset) {
//     var d = new Date(); var utc = d.getTime() + d.getTimezoneOffset() * 60000; var nd = new Date(utc + 3600000 * offset);
//     return nd.getDate();
// }

var t0 = performance.now(); //TESTING_ONLY

class ComponentToPrint extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      LocationName,
      LocationAddress,
      ServiceName,
      StartCharacter,
      Token,
      TokenWithStartChar,
      CurrentDatetime,
      TokensAhead,
    } = this.props;
    const style1_24L10 = {
      fontSize: "24px",
      textAlign: "left",
      paddingLeft: "10px",
    };
    const style2_32L10 = {
      fontSize: "32px",
      textAlign: "left",
      paddingLeft: "10px",
    };
    const style3_24L10B180 = {
      fontSize: "24px",
      textAlign: "left",
      paddingLeft: "10px",
      display: "block",
      height: "180px",
    };
    // console.log({
    //   LocationName: LocationName,
    //   LocationAddress: LocationAddress,
    //   ServiceName: ServiceName,
    //   TokenWithStartChar: TokenWithStartChar,
    //   CurrentDatetime: CurrentDatetime,
    //   TokensAhead: TokensAhead
    // });
    return (
      <div style={style3_24L10B180}>
        <p style={style2_32L10}>
          <strong>{LocationName}</strong>
        </p>
        <p style={style1_24L10}>{LocationAddress}</p>
        <p style={style1_24L10}>{ServiceName}</p>
        <p style={style2_32L10}>
          <strong>{TokenWithStartChar}</strong>
        </p>
        <p style={style1_24L10}>Date: {CurrentDatetime}</p>
        <p style={style1_24L10}>Customers ahead: {TokensAhead}</p>
        <p style={style1_24L10}>&nbsp;</p>
      </div>
    );
  }
}

function ComponentToPrint2(props) {
  //TESTING_ONLY
  const {
    LocationName,
    LocationAddress,
    ServiceName,
    StartCharacter,
    Token,
    TokenWithStartChar,
    CurrentDatetime,
    TokensAhead,
  } = props;
  const style1_24L10 = {
    fontSize: "24px",
    textAlign: "left",
    paddingLeft: "10px",
  };
  const style2_32L10 = {
    fontSize: "32px",
    textAlign: "left",
    paddingLeft: "10px",
  };
  const style3_24L10B180 = {
    fontSize: "24px",
    textAlign: "left",
    paddingLeft: "10px",
    display: "block",
    height: "180px",
  };
  return (
    <div style={style3_24L10B180}>
      <p style={style2_32L10}>
        <strong>{LocationName}</strong>
      </p>
      <p style={style1_24L10}>{LocationAddress}</p>
      <p style={style1_24L10}>{ServiceName}</p>
      <p style={style2_32L10}>
        <strong>{TokenWithStartChar}</strong>
      </p>
      <p style={style1_24L10}>Date: {CurrentDatetime}</p>
      <p style={style1_24L10}>Customers ahead: {TokensAhead}</p>
      <p style={style1_24L10}>&nbsp;</p>
    </div>
  );
}

//https://sung.codes/blog/2018/11/08/emulate-forceupdate-with-react-hooks/
const useForceUpdate = () => {
  const set = useState(0)[1];
  return () => set((s) => s + 1);
};

// function DelayedCounter() {
//   const [count, setCount] = React.useState(0)
//   const increment = async () => {
//     await doSomethingAsync()
//     setCount(previousCount => previousCount + 1)
//   }
//   return <button onClick={increment}>{count}</button>
// }
var fil1 = 0,
  latencyVal = 3;
function CounterRun(props) {
  //TESTING_ONLY
  if (!Firebase.apps.length) {
    Firebase.initializeApp(config);
  }

  const [loading, set_loading] = useState(true);
  const [alert, set_alert] = useState(null);

  const funcBaseURL = config.baseURL;
  // const funcBaseURL = "http://localhost:5000/antqueuelive/us-central1/";
  const [functions_base_url, set_functions_base_url] = useState(funcBaseURL);

  // //https://reactjs.org/docs/hooks-faq.html#is-there-something-like-forceupdate
  // const [_, forceUpdate] = useReducer((x) => x + 1, 0);

  // const forceUpdate = useForceUpdate();

  const [customer_id, set_customer_id] = useState(
    JSON.parse(localStorage.getItem("auth_info")).customer_id
  );
  const [api_key, set_api_key] = useState("");
  const [email, set_email] = useState(
    JSON.parse(localStorage.getItem("auth_info")).email
  );
  // const [user_id, set_user_id] = useState("");
  const [user_name, set_user_name] = useState("");
  const [
    request_approval_groups_assigned,
    set_request_approval_groups_assigned,
  ] = useState([]);

  const [main_location_id, set_main_location_id] = useState("");
  const [main_location_name, set_main_location_name] = useState("");
  const [sub_location_id, set_sub_location_id] = useState("");
  const [sub_location_name, set_sub_location_name] = useState("");
  const [service_id, set_service_id] = useState("");
  const [service_name, set_service_name] = useState("");
  const [services_list, set_services_list] = useState([]);
  const [serving_services_id_list, set_serving_services_id_list] = useState([]);
  const [filtered_services_id_list, set_filtered_services_id_list] = useState(
    []
  );
  const [
    filtered_serving_services_id_list,
    set_filtered_serving_services_id_list,
  ] = useState([]);
  const [serving_services_details, set_serving_services_details] = useState([]);
  //const [printing_services_id_list, set_printing_services_id_list] = useState([]);

  const [
    validate_serv_for_tok_range_overlap,
    set_validate_serv_for_tok_range_overlap,
  ] = useState(false);
  const [
    validate_serv_for_tok_range_overlap_failed,
    set_validate_serv_for_tok_range_overlap_failed,
  ] = useState(false);

  //const [sub_location_pending_count, set_sub_location_pending_count] = useState("");
  //const [main_location_pending_count, set_main_location_pending_count] = useState("");

  const [counter_id, set_counter_id] = useState(props.match.params.id || -1);
  const [counter_name, set_counter_name] = useState("");
  const [counter_state_char_limit, set_counter_state_char_limit] = useState(50);
  const [default_counter_state, set_default_counter_state] =
    useState("Occupied");
  const [counter_state, set_counter_state] = useState([]);
  const [default_counter_states, set_default_counter_states] = useState([]);
  const [custom_counter_states, set_custom_counter_states] = useState([]);
  const [combined_counter_states, set_combined_counter_states] = useState([]);
  //const [mac_add, set_mac_add] = useState("");
  const [start_date_formatted, set_start_date_formatted] = useState("");
  const [end_date_formatted, set_end_date_formatted] = useState("");

  //const [services_printing_id_list, set_services_printing_id_list] = useState([]);
  //const [selected_token_statuses, set_selected_token_statuses] = useState(null);
  const [call_based_on_service_date, set_call_based_on_service_date] =
    useState(true);
  const [call_specific_service, set_call_specific_service] = useState(false);
  //const [print_specific_service, set_print_specific_service] = useState(false);
  const [recall_already_called_token, set_recall_already_called_token] =
    useState(false);
  const [
    modify_service_details_for_display,
    set_modify_service_details_for_display,
  ] = useState(false);
  const [
    generate_token_for_specific_service,
    set_generate_token_for_specific_service,
  ] = useState(false);
  //const [counter_name_state, set_counter_name_state] = useState("has-success");
  const [curr_serv_time_HrMinSec, set_curr_serv_time_HrMinSec] = useState("");
  const [curr_waiting_time_Sec, set_curr_waiting_time_Sec] = useState(0);
  //const [serving_time, set_serving_time] = useState("");
  const [locked, set_locked] = useState("");

  const [hour_val, set_hour_val] = useState(0);
  const [min_val, set_min_val] = useState(0);
  const [sec_val, set_sec_val] = useState(-1);
  //const [number, set_number] = useState("");
  const [sub_offset, set_sub_offset] = useState("");
  const [time_zone, set_time_zone] = useState("");
  const [serving, set_serving] = useState(false);
  const [locked_and_verified, set_locked_and_verified] = useState(true);
  const [curr_token, set_curr_token] = useState({ number: "" });
  // useState({
  //   id: "",
  //   number: "",
  //   priority: "",
  //   date_stamp: "",
  //   service_id: "",
  //   taken_at: "",
  //   status: "",
  //   takenatunixtimestamp: "",
  // });

  const [temp_disabled_working_serv_ids, set_temp_disabled_working_serv_ids] =
    useState([]);

  const [phone_num, set_phone_num] = useState("");
  const [curr_day_unixts_min_val, set_curr_day_unixts_min_val] = useState(0);
  const [curr_day_unixts_max_val, set_curr_day_unixts_max_val] = useState(0);

  const [token_details_list, set_token_details_list] = useState([]);
  const [modal_classic, set_modal_classic] = useState(false);
  //const [modalTitle1, set_modalTitle1] = useState(""); //TESTING_ONLY ABC
  //const [modalBody1, set_modalBody1] = useState(""); //TESTING_ONLY ABC
  const [token_search_term, set_token_search_term] = useState("");

  const [LocationName, set_LocationName] = useState("");
  const [LocationAddress, set_LocationAddress] = useState("");
  const [ServiceName, set_ServiceName] = useState("");
  const [StartCharacter, set_StartCharacter] = useState("");
  const [Token, set_Token] = useState("");
  const [TokenWithStartChar, set_TokenWithStartChar] = useState("");
  const [CurrentDatetime, set_CurrentDatetime] = useState("");
  const [TokensAhead, set_TokensAhead] = useState("");
  const [curr_loaded_tok_id, set_curr_loaded_tok_id] = useState("");

  //const [prev_token_id, set_prev_token_id] = useState("");
  const [selected_file_attachments_arr, set_selected_file_attachments_arr] =
    useState([]);
  const [selected_input_fields_arr, set_selected_input_fields_arr] = useState(
    []
  );
  const [attachments, set_attachments] = useState([]);
  const [token_data, set_token_data] = useState({});
  const [accessible_locations, set_accessible_locations] = useState({});
  const [filterLatency, set_filterLatency] = useState(-1);
  const [sublocationServicesDetails, setSublocationServicesDetails] = useState(
    []
  );

  const [tokenData, setTokenData] = useState([]);

  const now = new Date().toLocaleTimeString();

  const notifyAlert = useRef(null);
  const componentRef = useRef();
  const mobileNumRef = useRef();
  // const firstUpdate = useRef(true);
  const triggerPrint = useRef(false);

  // //Ref: https://stackoverflow.com/questions/53253940/make-react-useeffect-hook-not-run-on-initial-render
  // useLayoutEffect(() => {
  //   // console.log("firstUpdate.current", firstUpdate.current);
  //   if (firstUpdate.current) {
  //     firstUpdate.current = false;
  //     // console.log("firstUpdate.current", firstUpdate.current);
  //     return;
  //   }

  //   //console.log("componentDidUpdateFunction");
  // });

  useEffect(() => {
    console.log("triggerPrint.current", triggerPrint.current);
    if (triggerPrint.current === true) {
      handlePrint && handlePrint(); //TESTING_ONLY 123
      triggerPrint.current = false;
    }
  }, [
    // LocationName, LocationAddress, ServiceName, StartCharacter, Token, CurrentDatetime, TokensAhead,
    triggerPrint.current,
  ]);

  useEffect(() => {
    if (filterLatency < latencyVal && filterLatency != -1)
      setTimeout(() => set_filterLatency(filterLatency + 1), 1000);
    fil1 = filterLatency;
    console.log("effect----", filterLatency);
  }, [filterLatency]);

  // Start a 1 second incrementing Timer and continuously save it to useState, upon sec_value change
  // console.log(`initializing timer interval`);
  useEffect(() => {
    const interval = setInterval(() => {
      if (sec_val != -1) set_sec_val((sec_val) => sec_val + 1);
      if (sec_val == 59) {
        set_sec_val(0);
        set_min_val((min_val) => min_val + 1);
      }
      if (min_val == 59) {
        set_min_val(0);
        set_hour_val((hour_val) => hour_val + 1);
      }
      set_curr_serv_time_HrMinSec(
        hour_val + ":" + min_val + ":" + (sec_val >= 0 ? sec_val : 1)
      );
    }, 1000);

    // Clean up when unmounted
    return () => {
      // Anything in here is fired on component unmount.
      // console.log(`clearing interval`)
      clearInterval(interval);
    };
  }, [sec_val]);

  // Start or restart Serving Timer
  const servingTimer = (
    hourVal = 0,
    minVal = 0,
    secVal = 0,
    pos = 0,
    refPos = ""
  ) => {
    set_loading(false);
    set_hour_val(hourVal);
    set_min_val(minVal);
    set_sec_val(secVal);
    if (pos === 0) refPos = refPos;
    if (pos === 1) refPos = "Get snapshot of Counter";
    if (pos === 2) refPos = "Get snapshot of Token Details";
    if (pos === 3) refPos = "Run handleCallNextToken";
    //if (pos === 4) refPos = "Reset Serving Timer";
    // console.log(
    //   "servingTimer value>> " +
    //   hour_val +
    //   ":" +
    //   min_val +
    //   ":" +
    //   sec_val +
    //   " invoking at pos>> " +
    //   pos +
    //   " refPos>> " +
    //   refPos
    // );
  };

  // function XCounter() {
  //   const [count, setCount] = useState(0);

  //   useEffect(() => {
  //     const id = setInterval(() => {
  //       setCount((c) => c + 1); // ✅ This doesn't depend on `count` variable outside
  //     }, 1000);
  //     return () => clearInterval(id);
  //   }, []); // ✅ Our effect doesn't use any variables in the component scope

  //   return <h1>{count}</h1>;
  // }

  /* 1. Loading Stage 1, Stage 2, Stage 3------------------------------------------------------*/
  useEffect(
    () => {
      let snap1 = () => {},
        snap2 = () => {};
      try {
        console.log("running useEffect loadData_Stage1/3");

        /* 1.0 Enable/disable functions emulator for testing */
        // Firebase.functions().useEmulator("localhost", 5000); //TESTING_ONLY firdous urgent
        console.log({
          METHOD_: "useEffect 1.0>>",
          functions_base_url: functions_base_url,
          timeNow: ((performance.now() - t0) / 1000).toFixed(2) + "s",
        });

        /* 1.1. Initialize localStorage and props vars (NO NEED, ALREADY DONE IN USESTATE)*/
        // let email = JSON.parse(localStorage.getItem("auth_info")).email;
        // let userId = JSON.parse(localStorage.getItem("auth_info")).email;
        // let customer_id = JSON.parse(localStorage.getItem("auth_info")).customer_id;
        // let counter_id = props.match.params.id || -1;
        console.log({
          METHOD_: "useEffect 1.1>>",
          email: email,
          // userId: userId,
          customer_id: customer_id,
          counter_id: counter_id,
          timeNow: ((performance.now() - t0) / 1000).toFixed(2) + "s",
        });

        /* 1.2. Counter Id and User Id (Email) validation */
        if (counter_id !== -1 && email !== -1) {
          /* 1.3. Save User related info to useState */
          Firebase.firestore()
            .collection("Web_App_Users")
            .doc(email)
            .get()
            .then(function (user_info) {
              if (user_info.exists) {
                set_api_key(user_info.data().API_Key);
                //set_email(user_info.id);
                //let role = "", find = roles.filter(item=>item.value===user_info.data().Role);
                //if (find.length > 0) { role = { label: find[0].name, value: find[0].value } }
                //set_role(role);

                /* 1.4. Save User related info to useState */
                // let user_id = JSON.parse(localStorage.getItem("auth_info")).email;
                // set_user_id(user_id);
                set_user_name(user_info.data().Name);
                set_request_approval_groups_assigned(
                  user_info.data().Request_Approval_Groups_Assigned
                );
                set_accessible_locations([
                  user_info.data().Accessible_Locations,
                ]); //TESTING_ONLY firdous urgent

                console.log({
                  METHOD_: "useEffect 1.3>>",
                  api_key: user_info.data().API_Key,
                  email: user_info.id,
                  counter_user_name: user_info.data().Name,
                  request_approval_groups_assigned:
                    user_info.data().Request_Approval_Groups_Assigned,
                  accessible_locations: user_info.data().Accessible_Locations,
                });

                /* 1.4.1 Check counter Serving IDs against Accessible_Locations */
                // firdous urgent task

                // getDefaultCounterStates();
                // setCounterStateToOccupied();
                // getCounterSnapshotData();
                // getServicesSnapshotData();

                /* 1.5. Get all Default & Custom Counter States */
                let defaultCounterStates = [];
                Firebase.firestore()
                  .collection("System_Config")
                  .doc("Counter_States")
                  .get()
                  .then((e) => {
                    latencyVal = e.data().Counter_Invocation_Latency;
                    e.data().States.forEach((b) => {
                      defaultCounterStates.push({ label: b, value: b });
                    });
                    set_default_counter_states(defaultCounterStates);
                    set_counter_state_char_limit(
                      e.data().Counter_State_Character_Limit || 4
                    );
                    console.log("defaultCounterStates", defaultCounterStates);
                    console.log(
                      "counter_state_char_limit",
                      e.data().Counter_State_Character_Limit
                    );
                    //console.log(">> loadData 2.2 >> QUERY>> System_Config >> defaultCounterStates", defaultCounterStates);

                    // })
                    // .then(() => {

                    //console.log("success!");
                    let customCounterStates = [];
                    let combinedCounterStates = [];
                    combinedCounterStates = defaultCounterStates;
                    Firebase.firestore()
                      .collection("System_Config")
                      .doc("Counter_States")
                      .collection("Custom_Counter_States_Collection")
                      .doc(customer_id)
                      .get()
                      .then(function (c) {
                        if (
                          c.exists &&
                          c.data().Custom_Counter_States !== undefined &&
                          c.data().Custom_Counter_States.length > 0
                        ) {
                          c.data().Custom_Counter_States.forEach((d) => {
                            customCounterStates.push({ label: d, value: d });
                          });

                          combinedCounterStates.push(...customCounterStates); //TESTING_ONLY firdous
                          set_custom_counter_states(customCounterStates);
                          set_combined_counter_states(combinedCounterStates);

                          console.log(
                            "customCounterStates",
                            customCounterStates
                          );
                          console.log(
                            "combinedCounterStates",
                            combinedCounterStates
                          );
                        } else {
                          set_custom_counter_states([]);
                          set_combined_counter_states(defaultCounterStates);

                          console.log("no custom counter states");
                          console.log(
                            "customCounterStates",
                            customCounterStates
                          );
                          console.log(
                            "combinedCounterStates",
                            combinedCounterStates
                          );
                        }
                        console.log({
                          METHOD_: "useEffect loadData 1.5>>",
                          defaultCounterStates: defaultCounterStates,
                          counter_state_char_limit:
                            e.data().Counter_State_Character_Limit,
                          customCounterStates: customCounterStates,
                          combinedCounterStates: combinedCounterStates,
                        });
                      });
                  });

                /* 2.1. Set Counter State to "Occupied" */
                let now = new Date();
                let currTimestamp = Math.floor(now.getTime());
                let currFirestoreTS =
                  Firebase.firestore.FieldValue.serverTimestamp(); //new Date();
                Firebase.firestore()
                  .collection("Counters")
                  .doc(counter_id)
                  .update({
                    Counter_State: "Occupied",
                    "Current_Token.date_stamp": currTimestamp,
                    "Current_Token.curr_firestore_timestamp": currFirestoreTS,
                  })
                  .then(() => {
                    console.log(
                      "useEffect 2.1 Counter State updated to 'Occupied' success!"
                    );

                    /* 1.6. Get Snapshot of Counter in case of changes (especially loaded Token) */
                    snap1 = Firebase.firestore()
                      .collection("Counters")
                      .doc(counter_id)
                      .onSnapshot((c) => {
                        if (c.exists) {
                          if (
                            c.data().Current_Token != undefined &&
                            c.data().Current_Token.number != undefined
                          ) {
                            console.log(c.data().Current_Token.number);
                            let sub =
                              new Date().getTime() / 1000 -
                              new Date(
                                c.data().Current_Token.servingTime
                              ).getTime() /
                                1000;
                            let hour = Math.trunc(sub / 60 / 60),
                              min = Math.trunc((sub - hour * 60 * 60) / 60),
                              sec = Math.trunc(
                                sub - (hour * 60 * 60 + min * 60)
                              );
                            console.log({
                              METHOD_: "useEffect 1.6>>",
                              sub: sub,
                              servingTime: c.data().Current_Token.servingTime,
                              timeNow:
                                ((performance.now() - t0) / 1000).toFixed(2) +
                                "s",
                            });

                            let timeZoneParts = c.data().TimeZone.split(")");
                            let timeZone = timeZoneParts[1];

                            let servingServs = c.data().Serving_Services || [];
                            let filteredServs =
                              c
                                .data()
                                .Filtered_Services.filter((e) =>
                                  servingServs.includes(e)
                                ) || [];
                            let filteredServingServs =
                              filteredServs.length > 0
                                ? filteredServs
                                : servingServs;
                            let servingServsDets =
                              c.data().Serving_Services_Details;

                            /* 2.4. Save Counter related Info to useState */
                            set_main_location_id(c.data().Main_Location_ID);
                            set_sub_location_id(c.data().Sub_Location_ID);
                            set_sub_offset(
                              c.data().TimeZone.split("UTC")[1].split(":")[0]
                            );
                            set_time_zone(timeZone);
                            set_serving_services_id_list(servingServs);
                            set_filtered_services_id_list(filteredServs);
                            set_filtered_serving_services_id_list(
                              filteredServingServs
                            );
                            set_serving_services_details(servingServsDets);

                            set_counter_name(c.data().Counter_Name);
                            set_counter_state({
                              label: c.data().Counter_State,
                              value: c.data().Counter_State,
                            });

                            set_locked(
                              c.data().Lock_To_Specific_Computer ? true : false
                            );
                            //set_services_printing_id_list(c.data().Printing_Services || []);
                            //set_user_id(c.data().Logged_In_User_ID);
                            //set_user_name(c.data().Logged_In_User_Name);
                            if (c.data().Current_Token.status == "Now_Serving")
                              servingTimer(
                                hour /*|| 0*/,
                                min /*|| 0*/,
                                sec /*|| 0*/,
                                1
                              );
                            else
                              servingTimer(
                                0 /*|| 0*/,
                                0 /*|| 0*/,
                                0 /*|| 0*/,
                                1
                              );
                            set_curr_token(c.data().Current_Token);
                            //TESTING_ONLY firdous
                            set_call_based_on_service_date(
                              c.data().Call_Based_On_Service_Date
                            );
                            set_call_specific_service(
                              c.data().User_Can_Call_Specific_Service
                            );
                            set_generate_token_for_specific_service(
                              c.data()
                                .User_Can_Generate_Token_For_Specific_Service
                            );
                            set_recall_already_called_token(
                              c.data().User_Can_Recall_Already_Called_Token
                            );
                            set_modify_service_details_for_display(
                              c.data()
                                .User_Can_Modify_Service_Details_For_Display
                            );
                            // console.log("hour", hour, "min", min, "sec", sec);
                            //   if (c.data().Counter_State == 'Closed')
                            //     setTimeout(() => {
                            //       props.history.push('/counters')
                            //     }, 2000)
                            //   //   if (
                            //     c.data().Current_Token.id != undefined &&
                            //     c.data().Current_Token.id.length > 0
                            //   )
                            //     showTokenDetail(c.data().Current_Token.id) //TESTING_ONLY firdous urgent
                            // })

                            //TESTING_ONLY firdous urgent
                            /* 1.7 Close all instances of a counter closed by an Admin, set loaded token to "Closed" status */
                            //console.log(">> setupData >> QUERY_SNAPSHOT>> Counters", id);
                            //console.log("Counter_State updated", c.data().Counter_State);
                            set_counter_state({
                              label: c.data().Counter_State,
                              value: c.data().Counter_State,
                            });

                            console.log({
                              METHOD_:
                                "useEffect counter snapshot CODE: 1.6, 2.4>>",
                              functions_base_url: functions_base_url,
                              "c.data().Current_Token.number":
                                c.data().Current_Token.number,
                              sub: sub,
                              "c.data().Current_Token.servingTime":
                                c.data().Current_Token.servingTime,
                              hour: hour,
                              min: min,
                              sec: sec,

                              main_location_id: c.data().Main_Location_ID,
                              sub_location_id: c.data().Sub_Location_ID,
                              sub_offset: c
                                .data()
                                .TimeZone.split("UTC")[1]
                                .split(":")[0],
                              time_zone: timeZone,
                              serving_services_id_list: servingServs,
                              filtered_services_id_list: filteredServs,
                              filtered_serving_services_id_list:
                                filteredServingServs,
                              serving_services_details: servingServsDets,
                              counter_name: c.data().Counter_Name,
                              counter_state: c.data().Counter_State,

                              servingTimer: (hour || 0, min || 0, sec || 0),
                              curr_token: c.data().Current_Token,
                              call_based_on_service_date:
                                c.data().Call_Based_On_Service_Date,
                              call_specific_service:
                                c.data().User_Can_Call_Specific_Service,
                              generate_token_for_specific_service:
                                c.data()
                                  .User_Can_Generate_Token_For_Specific_Service,
                              recall_already_called_token:
                                c.data().User_Can_Recall_Already_Called_Token,
                              modify_service_details_for_display:
                                c.data()
                                  .User_Can_Modify_Service_Details_For_Display,
                              serving_services_id_list:
                                c.data().Serving_Services,
                              filtered_services_id_list:
                                c.data().Filtered_Services,

                              timeNow:
                                ((performance.now() - t0) / 1000).toFixed(2) +
                                "s",
                            });

                            //console.log(">> setupData 3.1 >> check>> counterState", c.data().Counter_State);
                            if (c.data().Counter_State === "Closed") {
                              set_loading(false);
                              if (
                                c.data().Close_Admin_Name != undefined &&
                                c.data().Close_Admin_Name.length > 0
                              ) {
                                notifyMessage(
                                  "tc",
                                  3,
                                  `The counter has been closed by ${
                                    c.data().Close_Admin_Name
                                  }`
                                );
                                console.log(
                                  `The counter has been closed by ${
                                    c.data().Close_Admin_Name
                                  }: CODE: 1.6`
                                );
                              } else {
                                notifyMessage(
                                  "tc",
                                  3,
                                  `The counter has been closed.`
                                );
                                console.log(
                                  `The counter has been closed CODE: 1.6`
                                );
                              }
                              goBack();
                            }
                          }
                        }
                      });
                  })
                  .catch((error) => {
                    set_loading(false);
                    notifyMessage(
                      "tc",
                      3,
                      "Encountered an unexpected error while loading!"
                    );
                    console.error(
                      "Encountered an error while loading! error",
                      error
                    );
                    closeCounter();
                  });

                let servicesList = [],
                  i = 0;

                console.log("running loadData_Stage2/3"); //TESTING_FUNCTIONAL

                Firebase.firestore()
                  .collection("Counters")
                  .doc(counter_id)
                  .get()
                  .then((doc) => {
                    snap2 = Firebase.firestore()
                      .collection("Services")
                      .where("Customer_ID", "==", customer_id)
                      .where(
                        "Sub_Location_ID",
                        "==",
                        doc.data().Sub_Location_ID
                      )
                      .orderBy("Name", "asc")
                      .onSnapshot(function (response) {
                        i = 0;

                        response.docs.forEach(function (sDoc) {
                          if (doc.data().Serving_Services.includes(sDoc.id)) {
                            i++;

                            let stopTokWhenEndNumReached =
                              sDoc.data()
                                .Stop_Token_Generation_When_End_Num_Reached;
                            let tokDet_bySubLoc_byCurrDay_byAllUsers_byServ_length =
                              sDoc.data().Current_Token_Count;
                            let lastGenTokenForCurrDate =
                              sDoc.data().Last_Generated_Token;
                            let numberOfTokens = sDoc.data().Number_Of_Tokens;
                            let startNum = sDoc.data().Start_Number;
                            let endNum = sDoc.data().End_Number;
                            let tokRangeCount = 0;
                            let lastTokGenForServForToday = true;
                            let numTokRemainingForServForToday = 0;

                            if (
                              parseInt(numberOfTokens) != 0 &&
                              numberOfTokens != undefined
                            ) {
                              tokRangeCount = parseInt(numberOfTokens);
                            } else if (
                              parseInt(numberOfTokens) == 0 ||
                              numberOfTokens == undefined
                            ) {
                              tokRangeCount =
                                parseInt(endNum) - parseInt(startNum) + 1;
                            }

                            if (
                              (stopTokWhenEndNumReached == true &&
                                tokDet_bySubLoc_byCurrDay_byAllUsers_byServ_length >=
                                  tokRangeCount) ||
                              (stopTokWhenEndNumReached == true &&
                                (parseInt(lastGenTokenForCurrDate) >=
                                  parseInt(endNum) ||
                                  lastGenTokenForCurrDate.toString() ==
                                    endNum.toString())) //||
                            ) {
                              lastTokGenForServForToday = true;
                              numTokRemainingForServForToday = 0;
                            } else {
                              lastTokGenForServForToday = false;
                              numTokRemainingForServForToday =
                                tokRangeCount -
                                tokDet_bySubLoc_byCurrDay_byAllUsers_byServ_length;
                            }

                            let one = {
                              name: sDoc.data().Name,
                              main_location_id:
                                main_location_id ||
                                sDoc.data().Main_Location_ID,
                              sub_location_id:
                                sub_location_id || sDoc.data().Sub_Location_ID,
                              id: sDoc.id,
                              pending: sDoc.data().Waiting_In_Queue,
                              serv_last_called_tok:
                                sDoc.data().Last_Called_Number,
                              service_days: sDoc.data().Service_Days,
                              time_zone: sDoc.data().TimeZone,
                              start_num: parseInt(sDoc.data().Start_Number),
                              end_num: parseInt(sDoc.data().End_Number),
                              details: sDoc.data().Details || "",
                              serviceDetailsForDisplays:
                                sDoc.data().Service_Details_For_Display || "",
                              serviceDetailsForDisplaysToggle:
                                sDoc.data()
                                  .Service_Details_For_Display_Toggle || "",
                            };

                            var inc = false;
                            //filter out any service ids not included in counter's serving_services field
                            // csDoc.data().Serving_Services.forEach((b) => {

                            servicesList.forEach((b) => {
                              if (
                                doc.data().Serving_Services.includes(sDoc.id)
                              ) {
                                if (b.id == sDoc.id) {
                                  b.name = sDoc.data().Name;
                                  b.pending = sDoc.data().Waiting_In_Queue;
                                  b.priority = sDoc.data().Priority;
                                  b.serv_last_called_tok =
                                    sDoc.data().Last_Called_Number;
                                  inc = true;
                                }
                              }
                            });
                            //console.log(inc, "===============");
                            if (!inc) servicesList.push(one);

                            set_services_list(servicesList);
                            console.log("servicesList", servicesList);
                          }
                        });
                      });

                    //console.log(">> loadData 2.1 >> QUERY >> Counters");

                    /* 2.2 Close all instances of a counter if there aren"t any Serving_Services, and set loaded token to "Pending" status */
                    if (
                      doc.data().Serving_Services == undefined ||
                      doc.data().Serving_Services.length <= 0
                    ) {
                      set_loading(false);
                      notifyMessage(
                        "tc",
                        3,
                        `There are no services attached to this counter. Please check with your supervisor.`
                      );
                      console.error(
                        "No services attached to counter! CODE: 2.2"
                      );
                      closeCounter();
                    }
                    //console.log(">> loadData 2.2 >> Serving_Services.length >> ", doc.data().Serving_Services.length);

                    /* 2.3. Check if Counter Is Locked To PC */
                    if (
                      doc.data().Lock_To_Specific_Computer != undefined &&
                      doc.data().Lock_To_Specific_Computer.length > 0
                    ) {
                      setTimeout(function () {
                        Fingerprint2.getV18(
                          options1,
                          function (res, components) {
                            //console.log(">> loadData 2.4>> Lock_To_Specific_Computer", doc.data().Lock_To_Specific_Computer);
                            if (doc.data().Lock_To_Specific_Computer != res) {
                              set_locked_and_verified(false);
                            }
                          }
                        );
                      }, 50);
                    }

                    /* 2.4. Save Counter related Info to useState */
                    // set_main_location_id(doc.data().Main_Location_ID);
                    // set_sub_location_id(doc.data().Sub_Location_ID);
                    // set_counter_name(doc.data().Counter_Name);
                    // set_counter_state({
                    //   label: doc.data().Counter_State,
                    //   value: doc.data().Counter_State,
                    // }); //TESTING_ONLY

                    //  //TESTING_ONLY firdous urgent

                    //   set_call_based_on_service_date(c.data().Call_Based_On_Service_Date);
                    // } else {
                    //   set_call_based_on_service_date(c.data().Call_Based_On_Created_Date);
                    // }
                    // set_call_specific_service(doc.data().User_Can_Call_Specific_Service);
                    // set_generate_token_for_specific_service(doc.data().User_Can_Generate_Token_For_Specific_Service);
                    // set_recall_already_called_token(doc.data().User_Can_Recall_Already_Called_Token);
                    // set_modify_service_details_for_display(doc.data().User_Can_Modify_Service_Details_For_Display);
                    // set_serving_services_id_list(doc.data().Serving_Services);
                    set_filtered_services_id_list(
                      doc.data().Filtered_Services || []
                    );
                    // set_locked(doc.data().Lock_To_Specific_Computer ? true : false);
                    //set_services_printing_id_list(doc.data().Printing_Services || []);
                    //set_user_id(doc.data().Logged_In_User_ID);
                    //set_user_name(doc.data().Logged_In_User_Name);
                    //console.log(">> loadData 2.4 >> counter");

                    /* 2.5. Get Mainlocation Info */
                    Firebase.firestore()
                      .collection("Main_Locations")
                      .doc(doc.data().Main_Location_ID)
                      .get()
                      .then((e) => {
                        if (!e.empty) {
                          // set_main_location_id(e.id);
                          set_main_location_name(e.data().Name);
                        }
                        console.log({
                          METHOD_: "useEffect 2.5>>",
                          "e.id": e.id,
                          main_location_name: e.data().Name,
                          timeNow:
                            ((performance.now() - t0) / 1000).toFixed(2) + "s",
                        });
                      });

                    /* 2.6. Get Sublocation & TimeZone Info */
                    Firebase.firestore()
                      .collection("Sub_Locations")
                      .doc(doc.data().Sub_Location_ID)
                      .get()
                      .then((e) => {
                        if (!e.empty) {
                          if (e.data().Service_Details_For_Display?.length > 0)
                            setSublocationServicesDetails(
                              e
                                .data()
                                .Service_Details_For_Display?.map((e) => ({
                                  label: e?.value || e,
                                  value: e?.value || e,
                                }))
                            );

                          var validateServForTokRangeOverlap =
                            e.data()
                              .Validate_Service_For_Token_Number_Range_Overlap ||
                            false;
                          let validateServForTokRangeOverlapFailed = true; //(validateServForTokRangeOverlap == false) ? true : false;
                          var timeZoneParts = doc.data().TimeZone.split(")");
                          var timeZone = timeZoneParts[1];
                          // set_sub_location_id(e.id);
                          set_sub_location_name(e.data().Name);

                          // already set in counter
                          // set_sub_offset(e.data().TimeZone.split("UTC")[1].split(":")[0]);
                          // set_time_zone(timeZone);
                          // console.log("timeZone", timeZone, "sub_offset", sub_offset);

                          set_validate_serv_for_tok_range_overlap(
                            validateServForTokRangeOverlap
                          );
                          set_validate_serv_for_tok_range_overlap_failed(
                            validateServForTokRangeOverlapFailed
                          );

                          /* Load Default Date*/
                          //let today = new Date();
                          console.log("timeZone loadDefaultDate", timeZone);
                          let startDateFmt = moment()
                            .tz(timeZone)
                            .startOf("day")
                            .unix();
                          let endDateFmt = moment()
                            .tz(timeZone)
                            .endOf("day")
                            .unix();
                          console.log(
                            "startDateFmt",
                            startDateFmt,
                            "endDateFmt",
                            endDateFmt
                          );

                          set_start_date_formatted(startDateFmt);
                          set_end_date_formatted(endDateFmt);

                          // /* 3.0. Get Snapshot of Services in case of changes (especially serving / filtered services and pending tokens) */
                          console.log("running loadData_Stage3/3"); //TESTING_FUNCTIONAL
                          console.log(
                            "default_counter_states",
                            default_counter_states
                          );
                          let i = 0,
                            servs,
                            sn2;
                          let servicesList = [];
                          //let timeZone = time_zone;

                          let currUnixTimeStamp = Math.floor(
                            new Date().getTime() / 1000
                          );
                          let currDateFormatted = moment(
                            new Date(currUnixTimeStamp * 1000)
                          )
                            .tz(timeZone)
                            .format("YYYY-MM-DD")
                            .toString();
                          let currDayUnixTSMinVal = 0;
                          let currDayUnixTSMaxVal = 10000000000; //Saturday, November 20, 2286 10:46:40 PM GMT+05:00
                          currDayUnixTSMinVal = moment()
                            .tz(timeZone)
                            .startOf("day")
                            .unix();
                          currDayUnixTSMaxVal = moment()
                            .tz(timeZone)
                            .endOf("day")
                            .unix();

                          let servingServiceIds = [];
                          //if (serving_services_id_list.length != undefined && serving_services_id_list.length > 0) {
                          //^ no need because already checked in Load Data Stage 2
                          servingServiceIds = serving_services_id_list;
                          //}

                          set_curr_day_unixts_min_val(currDayUnixTSMinVal);
                          set_curr_day_unixts_max_val(currDayUnixTSMaxVal);

                          console.log({
                            loadData_Stage3: "loadData_Stage3",
                            currUnixTimeStamp: currUnixTimeStamp,
                            currDateFormatted: currDateFormatted,
                            currDayUnixTSMinVal: currDayUnixTSMinVal,
                            currDayUnixTSMaxVal: currDayUnixTSMaxVal,
                          });

                          //let servUnixTimeStamp = Math.floor(new Date().getTime() / 1000);
                          //let servDateFormatted = (moment(new Date(servUnixTimeStamp*1000)).tz(timeZone).format("YYYY-MM-DD")).toString();

                          //let servUnixTimeStampMinVal = 0;
                          //let servUnixTimeStampMaxVal = 10000000000; //Saturday, November 20, 2286 10:46:40 PM GMT+05:00
                          //servUnixTimeStampMinVal = (moment(servDateFormatted).tz(timeZone).startOf("day")).unix();
                          //servUnixTimeStampMaxVal = (moment(servDateFormatted).tz(timeZone).endOf("day")).unix();

                          //setTimeout(() => {

                          if (doc.data().Counter_State == "Occupied") {
                            /* 3.2 Initialize services_list */
                            //if (i == 0){
                            doc.data().Serving_Services.forEach((e) => {
                              //let inc = false
                              //servicesList.forEach(b => {
                              //  if (Object.values(b).includes(e)) inc = true
                              //})
                              if (
                                validateServForTokRangeOverlapFailed == true
                              ) {
                                Firebase.firestore()
                                  .collection("Services")
                                  .doc(e)
                                  .get()
                                  // .then(
                                  //   (d) => {
                                  .then(
                                    function (d) {
                                      if (d.exists) {
                                        console.log("FIR>ERR>>1 servid", e);

                                        var startNum = parseInt(
                                          d.data().Start_Number
                                        );
                                        var endNum = parseInt(
                                          d.data().End_Number
                                        );

                                        for (
                                          var i = 0;
                                          i < servicesList.length;
                                          i++
                                        ) {
                                          console.log(
                                            "servListStartNum",
                                            servListStartNum || "-1"
                                          );
                                          console.log(
                                            "servListEndNum",
                                            servListEndNum || "-1"
                                          );
                                          console.log(
                                            "servicesList[i].start_num",
                                            servicesList[i].start_num || "-1"
                                          );
                                          console.log(
                                            "servicesList[i].end_num",
                                            servicesList[i].end_num || "-1"
                                          );
                                          // console.log("servListStartNum", servListStartNum || "-1");
                                          // console.log("servListStartNum", servListStartNum || "-1");
                                          // console.log("servListStartNum", servListStartNum || "-1");
                                          //for (var i = 0; -servicesList.length; i++) {
                                          var servListStartNum =
                                            servicesList[i].start_num;
                                          var servListEndNum =
                                            servicesList[i].end_num;

                                          console.log(
                                            "validate_serv_for_tok_range_overlap",
                                            validate_serv_for_tok_range_overlap
                                          );
                                          if (
                                            validateServForTokRangeOverlap ==
                                            true
                                          ) {
                                            if (
                                              //(i==2 && 1+1!=2) && //TESTING_ONLY firdous urgent 1+1==2
                                              (startNum > servListStartNum &&
                                                startNum > servListEndNum &&
                                                endNum > servListStartNum &&
                                                endNum > servListEndNum) ||
                                              (startNum < servListStartNum &&
                                                startNum < servListEndNum &&
                                                endNum < servListStartNum &&
                                                endNum < servListEndNum)
                                            ) {
                                              console.log({
                                                METHOD_: "useEffect 3.2>>",
                                                COMPARE_sameRangeServiceinCounter: false,
                                                Comparing_startNum: startNum,
                                                Comparing_endNum: endNum,
                                                Against_servListStartNum:
                                                  servListStartNum,
                                                Against_servListEndNum:
                                                  servListEndNum,
                                                servid: e,
                                                timeNow:
                                                  (
                                                    (performance.now() - t0) /
                                                    1000
                                                  ).toFixed(2) + "s",
                                              });
                                            } else {
                                              console.log({
                                                METHOD_: "useEffect 3.2>>",
                                                COMPARE_sameRangeServiceinCounter: true,
                                                Comparing_startNum: startNum,
                                                Comparing_endNum: endNum,
                                                Against_servListStartNum:
                                                  servListStartNum,
                                                Against_servListEndNum:
                                                  servListEndNum,
                                                servid: e,
                                                timeNow:
                                                  (
                                                    (performance.now() - t0) /
                                                    1000
                                                  ).toFixed(2) + "s",
                                              });
                                              //console.log("validateServForTokRangeOverlapFailed 3 timestamp_ms", false, performance.now()-t0);
                                              validateServForTokRangeOverlapFailed = false;
                                              set_loading(false);
                                              notifyMessage(
                                                "tc",
                                                3,
                                                "One or more Service(s) configured for this Counter has the same token range as another Service in this Counter. Please contact your System Administrator as this is not currently allowed!"
                                              );
                                              console.error(
                                                "One or more Service(s) configured for this Counter has the same token range as another Service in this Counter. CODE: 3.X"
                                              );
                                              closeCounter();
                                              break;
                                            }
                                          }
                                        }

                                        console.log({
                                          cmnt: "test7",
                                          name: d.data().Name,
                                          main_location_id:
                                            main_location_id ||
                                            d.data().Main_Location_ID,
                                          sub_location_id:
                                            sub_location_id ||
                                            d.data().Sub_Location_ID,
                                          id: e,
                                          pending: pending,
                                          serv_last_called_tok:
                                            serv_last_called_tok,
                                          service_days: d.data().Service_Days,
                                          time_zone: d.data().TimeZone,
                                          start_num: parseInt(
                                            d.data().Start_Number
                                          ),
                                          end_num: parseInt(
                                            d.data().End_Number
                                          ),
                                        });

                                        if (
                                          validateServForTokRangeOverlapFailed ==
                                          true
                                        ) {
                                          console.log(
                                            "validateServForTokRangeOverlapFailed 1 timestamp_ms",
                                            true,
                                            performance.now() - t0
                                          ); //(1+1!=2) && //TESTING_ONLY 1+1==2 || firdous urgent

                                          servicesList.push({
                                            name: d.data().Name,
                                            main_location_id:
                                              main_location_id ||
                                              d.data().Main_Location_ID,
                                            sub_location_id:
                                              sub_location_id ||
                                              d.data().Sub_Location_ID,
                                            id: e,
                                            pending: pending,
                                            serv_last_called_tok:
                                              serv_last_called_tok,
                                            service_days: d.data().Service_Days,
                                            time_zone: d.data().TimeZone,
                                            start_num: parseInt(
                                              d.data().Start_Number
                                            ),
                                            end_num: parseInt(
                                              d.data().End_Number
                                            ),
                                            details: d.data().Details || "",
                                          });

                                          //console.log(">> setupData 3.1 >> QUERY>> Services >> d", d)
                                          var emp = true,
                                            pending = 0,
                                            serv_last_called_tok = ""; ////_Total&Served_//dd = new Date(), day = parseInt(calcTimeday(offs)), total = 0, pending = 0, served = 0
                                          //servicesList.forEach(b => {
                                          //   if (b.id == e) {
                                          //       emp = false
                                          //   }
                                          //})

                                          //set_services_list(servicesList);
                                          //console.log(">> setupData 3.2 >> INIT>> servicesList", servicesList);

                                          // NO NEED FOR THIS QUERY ANYMORE
                                        } else {
                                          console.log(
                                            "validateServForTokRangeOverlapFailed 1 timestamp_ms",
                                            false,
                                            performance.now() - t0
                                          ); //(1+1!=2) && //TESTING_ONLY 1+1==2 || firdous
                                        }
                                      }
                                    },
                                    (error) => {
                                      console.log("error4==>", error);
                                      //notifyMessage("tc", 3, "Permission Error!");
                                    }
                                  );
                              }
                            });
                          }
                        }
                      });

                    /* DISABLED 2.9. Load Printing Services */
                    //console.log(">> loadData 2.8 >> loadPrintingServices(id)");
                    //loadPrintingServices(id);
                  });
              } else {
                set_loading(false);
                notifyMessage("tc", 3, "User not found!");
                console.error("User not found! CODE: 1.3");
                closeCounter();
              }
            });
        } else {
          set_loading(false);
          notifyMessage(
            "tc",
            3,
            "Encountered an unexpected error while loading!"
          );
          console.error(
            "Encountered an unexpected error while loading! Counter Id and/or User Id (Email) validation unsuccesful! CODE: 1.2"
          );
          closeCounter();
        }

        //set_loading(false); //moved this into the next useEffect
      } catch (error) {
        set_loading(false);
        notifyMessage(
          "tc",
          3,
          "Encountered an unexpected error while loading!"
        );
        console.error("Encountered an error while loading! error", error);
        closeCounter();
      }

      // Clean up when unmounted
      return () => {
        // Anything in here is fired on component unmount.
        console.log("component unmount loadData_state1,2,3");
        snap1();
        snap2();
      };
    },
    [
      //serving //TESTING_FUNCTIONAL
      // curr_token,
      // counter_id,
      // functions_base_url,
      // api_key,
      // email,
      // loading,
      // user_id,
      // user_name,
      // default_counter_states,
      // counter_state_char_limit,
      // custom_counter_states,
      // combined_counter_states
    ]
  ); // passing an empty array as second argument triggers the callback in useEffect only
  // after initial render thus replicating `componentDidMount` lifecycle behaviour

  // // Set loading to false *ONLY* after previous useEffect
  // // Some additional research on React Suspense needed:
  // // https://reactjs.org/docs/concurrent-mode-suspense.html
  // useEffect(() => {
  //   set_loading(false);
  //   console.log("set_loading false in useEffect 2")
  //   // Clean up when unmounted
  //   return () => {
  //       // Anything in here is fired on component unmount.
  //   }
  // }, []);

  const formatDate = (date) => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) {
      month = "0" + month;
    }
    if (day.length < 2) {
      day = "0" + day;
    }
    return [year, month, day].join("-");
  };

  const formatUnixTimestamps = (timestamp, secOrMilliSec) => {
    secOrMilliSec = secOrMilliSec || "s";
    let timestampStr = timestamp.toString();
    let result = 0;
    if (secOrMilliSec === "s") {
      if (timestampStr.length === 10) {
        result = parseInt(timestamp);
      } else if (timestampStr.length === 13) {
        result = parseInt(timestampStr.substring(0, 10));
      } else if (timestamp === 0 || timestampStr.length === 1) {
        result = Date.now() / 1000;
      }
    }

    if (secOrMilliSec === "ms") {
      if (timestampStr.length === 10) {
        result = parseInt(timestamp * 1000);
      } else if (timestampStr.length === 13) {
        result = parseInt(timestampStr.substring(0, 13));
      } else if (timestamp === 0 || timestampStr.length === 1) {
        result = Date.now();
      }
    }
    return result;
  };

  /* 4. HandleCallNextToken__ Btn--------------------------------------------------------------------*/
  const handleCallNextToken = async () => {
    // console.log("running handleCallNextToken__ curr_token", curr_token);
    //4.1. Init
    set_loading(true);
    let currTokNum = curr_token.number || -1;

    //4.2 call GCF apiHandleCounterRun > func callNextToken (cmd_: "C1")
    var now = new Date();
    var currTimestamp = Math.floor(now.getTime() / 1000);
    // console.log(
    //   "currTokNum",
    //   currTokNum,
    //   "curr_token.number",
    //   curr_token.number,
    //   "time_zone",
    //   time_zone,
    //   "sub_offset",
    //   sub_offset,
    //   "counter_state",
    //   counter_state
    // );

    // Handled by apiHandleCounterRun
    // /* 4.0 Set Counter State to "Occupied" if it's not */
    // if (counter_state.value !== "Occupied") {
    //   set_counter_state({ label: default_counter_state, value: default_counter_state });
    // }

    // console.log("2>>counter_state", counter_state);

    // if (currTokNum !== -1) {
    // console.log("path1 currTokNum !== -1");

    /* 4.1 Get Serving_Time ("Waiting_Time") from the Timer */
    // console.log("time_zone", time_zone, "sub_offset", sub_offset);
    let newDate = new Date(curr_token.date_stamp),
      currentHour = parseInt(calcTime(time_zone).split(":")[0]),
      currentMinute = parseInt(calcTime(time_zone).split(":")[1]),
      genHour = parseInt(newDate.getHours()),
      genMinute = parseInt(newDate.getMinutes());
    //let waitingtime = (currentHour - genHour) * 60 * 60 + (currentMinute - genMinute) * 60;
    //let curr_serv_time_HrMinSec = curr_serv_time_HrMinSec;
    let currWaitingTimeInSec = currTimestamp - curr_token.takenatunixtimestamp;
    // console.log(
    //   "curr_token1",
    //   "before_calling_gcf",
    //   curr_token,
    //   "newDate",
    //   newDate,
    //   "currentHour",
    //   currentHour,
    //   "currentMinute",
    //   currentMinute,
    //   "genHour",
    //   genHour,
    //   "genMinute",
    //   genMinute,
    //   // "waitingtime",
    //   // waitingtime,
    //   // "waitingtime2",
    //   // waitingtime2,
    //   "curr_serv_time_HrMinSec",
    //   curr_serv_time_HrMinSec,
    //   "currWaitingTimeInSec",
    //   currWaitingTimeInSec,
    //   "currTimestamp",
    //   currTimestamp,
    //   "curr_token.takenatunixtimestamp",
    //   curr_token.takenatunixtimestamp
    // );

    /* 4.2 Call "apiCounterRun-callNextToken" cloud function,
                   to process currently loaded Token and THEN call next Token */
    // console.log("running updateTokens__ curr_token", curr_token);

    let params = {
      version: "1",
      cmd_: "C1",
      // apiKey: api_key || "",
      customerId: customer_id || "",
      // mainLocId: main_location_id || "",
      subLocId: sub_location_id || "",
      // serviceId: service_id || "",
      counterId: counter_id || "",
      emailId: email || "",
      userId: email || "",
      userName: user_name || "",
      // ^common params
      //filteredServsIDList: filtered_services_id_list || [],
      //currTokId: curr_token.id || "",
      servingTime: curr_serv_time_HrMinSec || "",
      waitingTime: currWaitingTimeInSec || 0,
      tokenStatus: "Served",
      //localTimeNow: new Date(),
      //currDayUnixTSMaxVal: curr_day_unixts_max_val || "",
      timeZone: time_zone || "",
      callBasedOnServDate: call_based_on_service_date,
    };
    // Firebase.functions().useEmulator("localhost", 5000);
    let c1Result = await callApiHandleCounterRun({ params });
    // console.log("c1Result", c1Result);

    // } else {
    //   console.log("path2 currTokNum === -1");
    //   servingTimer(0, 0, 0, 3);

    //   Firebase.firestore()
    //     .collection("Counters")
    //     .doc(counter_id)
    //     .update({
    //       Blink: true,
    //       Counter_State: "Occupied",
    //       Repeat: false,
    //     })
    //     .then(() => {
    //       //console.log("Counter_State: Occupied");
    //       //callApiHandleCounterRun("Served"); //TESTING_ONLY firdous urgent
    //     })
    //     .catch((err) => {
    //       console.log("update_query_error8", err);
    //     });
    // }
  };

  // /* 5. Update Tokens---------------------------------------------------------------------*/
  // const callApiHandleCounterRun = (e) => {

  // };

  const showTokenDetail = (id) => {
    if (id?.length > 0)
      set_alert(
        <ReactBSAlert
          title={""}
          onConfirm={() => hideAlert()}
          onCancel={() => hideAlert()}
          style={{ width: "60vw" }}
        >
          <TokenModal
            id={id}
            set_loading={(e) => set_loading(e)}
            notifyMessage={notifyMessage}
          />
        </ReactBSAlert>
      );
    else
      notifyMessage(
        "tc",
        3,
        `Please click "Next" button first! If there is any pending token to serve, its details will be made available.`
      );
  };

  const To = () => {
    set_alert(
      <ReactBSAlert
        title={"Sub Location Tokens"}
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        style={{ width: "60vw" }}
      >
        <SubTokens
          ids={accessible_locations}
          hide={() => hideAlert}
          TokenDetails={() => showTokenDetail}
          customer_id={customer_id}
          request_approval_groups_assigned={request_approval_groups_assigned}
        />
      </ReactBSAlert>
    );
  };

  //   const handleAttachments = () => {
  //     //TESTING_ONLY ABC ABC
  //     // REFER TO  async handleRequest(selectedToken, action, modalToggle) {
  //     // in ServiceRequests screen

  //     // let _this = this
  //     // let token_details_list = [];
  //     let i = 0

  //     let customer_id = JSON.parse(localStorage.getItem("auth_info")).customer_id
  //     let startDateFmt = start_date_formatted
  //     let endDateFmt = end_date_formatted
  //     let reqApprovalGrpArr = approving_user_request_approval_groups || undefined
  //     console.log(
  //       "startDateFmt",
  //       startDateFmt,
  //       "endDateFmt",
  //       endDateFmt,
  //       "reqApprovalGrpArr",
  //       reqApprovalGrpArr
  //     )
  //     let selected_main_locations = selected_main_locations
  //     let selected_sub_locations = selected_sub_locations
  //     let selected_services = selected_services
  //     let selected_request_approval_groups = selected_request_approval_groups
  //     let selected_token_statuses = selected_token_statuses

  //     let selectedMainLocIds = selected_main_locations.map((prop, key) => {
  //       return prop.value
  //     })
  //     let selectedSubLocIds = selected_sub_locations.map((prop, key) => {
  //       return prop.value
  //     })
  //     let selectedServIds = selected_services.map((prop, key) => {
  //       return prop.value
  //     })
  //     let selectedReqAppGrpIds = []
  //     if (
  //       selected_request_approval_groups !== null &&
  //       selected_request_approval_groups.length > 0
  //     ) {
  //       selectedReqAppGrpIds = selected_request_approval_groups.map(
  //         (prop, key) => {
  //           return prop.value
  //         }
  //       )
  //     }
  //     let selectedTokStatuses = selected_token_statuses.map((prop, key) => {
  //       return prop.value
  //     })

  //     if (
  //       reqApprovalGrpArr === null ||
  //       typeof reqApprovalGrpArr == "undefined" ||
  //       reqApprovalGrpArr.length <= 0
  //     ) {
  //       _this.notifyMessage(
  //         "tc",
  //         3,
  //         "Sorry you don't have access to approve any service requests. Please contact your System Administrator"
  //       )
  //       _this.setState({ loading: false })
  //       return
  //     }

  //     let response

  //     Firebase.firestore()
  //       .collection("Token_Details")
  //       .where("Customer_ID", "==", customer_id)
  //       .where("Created_Datetime_Unix_Timestamp", ">=", startDateFmt)
  //       .where("Created_Datetime_Unix_Timestamp", "<=", endDateFmt)
  //       .where("Requires_Approval", "==", true)
  //       .where("Request_Approval_Group_Profile_Id", "in", reqApprovalGrpArr)
  //       .onSnapshot(
  //         function (response) {
  //           let token_details_list = []
  //           response.docs.forEach(function (tok) {
  //             console.log({
  //               selectedMainLocIds: selectedMainLocIds,
  //               selectedSubLocIds: selectedSubLocIds,
  //               selectedServIds: selectedServIds,
  //               selectedTokStatuses: selectedTokStatuses,
  //               selectedReqAppGrpIds: selectedReqAppGrpIds,
  //               "tok.data().Main_Location_ID": tok.data().Main_Location_ID,
  //               "tok.data().Sub_Location_ID": tok.data().Sub_Location_ID,
  //               "tok.data().Services_ID": tok.data().Services_ID,
  //               "tok.data().Token_Status": tok.data().Token_Status,
  //               "tok.data().Request_Approval_Group_Profile_Id": tok.data()
  //                 .Request_Approval_Group_Profile_Id
  //             })
  //             console.log(
  //               "here2 selectedReqAppGrpIds.length",
  //               selectedReqAppGrpIds.length,
  //               "selectedReqAppGrpIds",
  //               selectedReqAppGrpIds,
  //               "tok.data().Request_Approval_Group_Profile_Id",
  //               tok.data().Request_Approval_Group_Profile_Id
  //             )
  //             if (selectedReqAppGrpIds.length > 0) {
  //               if (
  //                 selectedMainLocIds.includes(tok.data().Main_Location_ID) &&
  //                 selectedSubLocIds.includes(tok.data().Sub_Location_ID) &&
  //                 selectedServIds.includes(tok.data().Services_ID) &&
  //                 selectedTokStatuses.includes(tok.data().Token_Status) &&
  //                 selectedReqAppGrpIds.includes(
  //                   tok.data().Request_Approval_Group_Profile_Id
  //                 )
  //               ) {
  //                 console.log(
  //                   "path A1 selectedReqAppGrpIds.length",
  //                   selectedReqAppGrpIds.length
  //                 )
  //                 const option = {
  //                   token_detail_id: tok.id,
  //                   id: tok.id,
  //                   value: tok.id,
  //                   customer_id: tok.data().Customer_ID,
  //                   created_datetime: tok.data().Created_Datetime,
  //                   created_datetime_ts: tok.data()
  //                     .Created_Datetime_Unix_Timestamp,
  //                   requested_datetime: tok.data().Requested_Datetime,
  //                   requested_datetime_ts: tok.data()
  //                     .Requested_Datetime_Unix_Timestamp,
  //                   service_datetime: tok.data().Service_Datetime,
  //                   service_datetime_formatted: moment(
  //                     new Date(
  //                       parseInt(tok.data().Service_Datetime_Unix_Timestamp) *
  //                         1000
  //                     )
  //                   )
  //                     .tz(tok.data().TimeZone)
  //                     .format("YYYY-MM-DD"),
  //                   service_datetime_ts: tok.data()
  //                     .Service_Datetime_Unix_Timestamp,
  //                   internal_response: tok.data().Internal_Response,
  //                   service_type: tok.data().Service_Type,
  //                   start_char: tok.data().Start_Character,
  //                   input_source: tok.data().Input_Source,
  //                   main_location_id: tok.data().Main_Location_ID,
  //                   sub_location_id: tok.data().Sub_Location_ID,
  //                   serv_id: tok.data().Services_ID,
  //                   main_loc_nam: tok.data().Main_Location_Name,
  //                   sub_loc_nam: tok.data().Sub_Location_Name,
  //                   serv_name: tok.data().Service_Name,
  //                   serv_start_date: tok.data().Service_Start_Datetime,
  //                   token_num: tok.data().Token_Number_String,
  //                   token_status: tok.data().Token_Status,
  //                   waiting_time: tok.data().Waiting_Time,
  //                   mau_id: tok.data().Mobile_App_User_ID,
  //                   mau_contact: tok.data().Mobile_App_User_Contact,
  //                   mau_email: tok.data().Mobile_App_User_Email,
  //                   mau_name: tok.data().Mobile_App_User_Name,
  //                   time_zone: tok.data().TimeZone,
  //                   new_tok_ref_id: tok.data().New_Token_Reference_ID,
  //                   new_tok_ref_num: tok.data().New_Token_Reference_Num,
  //                   cancelled_tok_ref_id: tok.data().Cancelled_Token_Reference_ID,
  //                   cancelled_tok_ref_num: tok.data()
  //                     .Cancelled_Token_Reference_Num,
  //                   new_tok_ref_prev_tok_cancelled_reason: tok.data()
  //                     .Cancelled_Reason,
  //                   input_fields: tok.data().Mobile_App_Input_Fields,
  //                   file_attachments: tok.data().Mobile_App_File_Attachments

  //                   // label: Name,
  //                 }
  //                 token_details_list.push(option)
  //               } else {
  //                 console.log(
  //                   "path A2 selectedReqAppGrpIds.length",
  //                   selectedReqAppGrpIds.length
  //                 )
  //               }
  //             } else {
  //               if (
  //                 selectedMainLocIds.includes(tok.data().Main_Location_ID) &&
  //                 selectedSubLocIds.includes(tok.data().Sub_Location_ID) &&
  //                 selectedServIds.includes(tok.data().Services_ID) &&
  //                 selectedTokStatuses.includes(tok.data().Token_Status)
  //               ) {
  //                 console.log(
  //                   "path B1 selectedReqAppGrpIds.length",
  //                   selectedReqAppGrpIds.length
  //                 )
  //                 const option = {
  //                   token_detail_id: tok.id,
  //                   id: tok.id,
  //                   value: tok.id,
  //                   customer_id: tok.data().Customer_ID,
  //                   created_datetime: tok.data().Created_Datetime,
  //                   created_datetime_ts: tok.data()
  //                     .Created_Datetime_Unix_Timestamp,
  //                   requested_datetime: tok.data().Requested_Datetime,
  //                   requested_datetime_ts: tok.data()
  //                     .Requested_Datetime_Unix_Timestamp,
  //                   service_datetime: tok.data().Service_Datetime,
  //                   service_datetime_formatted: moment(
  //                     new Date(
  //                       parseInt(tok.data().Service_Datetime_Unix_Timestamp) *
  //                         1000
  //                     )
  //                   )
  //                     .tz(tok.data().TimeZone)
  //                     .format("YYYY-MM-DD"),
  //                   service_datetime_ts: tok.data()
  //                     .Service_Datetime_Unix_Timestamp,
  //                   internal_response: tok.data().Internal_Response,
  //                   service_type: tok.data().Service_Type,
  //                   start_char: tok.data().Start_Character,
  //                   input_source: tok.data().Input_Source,
  //                   main_location_id: tok.data().Main_Location_ID,
  //                   sub_location_id: tok.data().Sub_Location_ID,
  //                   serv_id: tok.data().Services_ID,
  //                   main_loc_nam: tok.data().Main_Location_Name,
  //                   sub_loc_nam: tok.data().Sub_Location_Name,
  //                   serv_name: tok.data().Service_Name,
  //                   serv_start_date: tok.data().Service_Start_Datetime,
  //                   token_num: tok.data().Token_Number_String,
  //                   token_status: tok.data().Token_Status,
  //                   waiting_time: tok.data().Waiting_Time,
  //                   mau_id: tok.data().Mobile_App_User_ID,
  //                   mau_contact: tok.data().Mobile_App_User_Contact,
  //                   mau_email: tok.data().Mobile_App_User_Email,
  //                   mau_name: tok.data().Mobile_App_User_Name,
  //                   time_zone: tok.data().TimeZone,
  //                   new_tok_ref_id: tok.data().New_Token_Reference_ID,
  //                   new_tok_ref_num: tok.data().New_Token_Reference_Num,
  //                   cancelled_tok_ref_id: tok.data().Cancelled_Token_Reference_ID,
  //                   cancelled_tok_ref_num: tok.data()
  //                     .Cancelled_Token_Reference_Num,
  //                   new_tok_ref_prev_tok_cancelled_reason: tok.data()
  //                     .Cancelled_Reason,
  //                   input_fields: tok.data().Mobile_App_Input_Fields,
  //                   file_attachments: tok.data().Mobile_App_File_Attachments
  //                   // label: Name,
  //                 }
  //                 token_details_list.push(option)
  //               } else {
  //                 console.log(
  //                   "path B2 selectedReqAppGrpIds.length",
  //                   selectedReqAppGrpIds.length
  //                 )
  //               }
  //             }
  //           })

  //           // _this.multiSort(token_details_list,{ name: "asc" });
  //           _this.setState({ token_details_list: [] })
  //           _this.setState({ token_details_list: token_details_list })
  //           _this.setState({ loading: false })
  //           console.log("token_details_list", token_details_list)
  //           console.log("reached here #5 done")
  //         },
  //         error => {
  //           _this.setState({ loading: false })
  //           console.error(`Encountered error: ${error}`)
  //         }
  //       )
  //   }

  /* 6. Update Token Recall---------------------------------------------------------------------*/
  const updateTokenRecall = async (tokenForRecall) => {
    console.log("running updateTokenRecall()__ tokenForRecall", tokenForRecall);
    set_loading(true);
    set_modal_classic({ modal_classic: !modal_classic }); //TESTING_ONLY //firdous

    let customerId = JSON.parse(localStorage.getItem("auth_info")).customer_id;
    let customer_id = customerId;
    let currDayUnixTSMinVal = curr_day_unixts_min_val;
    let currDayUnixTSMaxVal = curr_day_unixts_max_val;
    let selectedServingServIds = serving_services_id_list;

    /* 5.1 Set currently Loaded Token as "Served" */

    let params = {
      version: "1",
      cmd_: "C4",
      // apiKey: api_key || "",
      customerId: customer_id || "",
      // mainLocId: main_location_id || "",
      subLocId: sub_location_id || "",
      // serviceId: service_id || "",
      counterId: counter_id || "",
      emailId: email || "",
      userId: email || "",
      userName: user_name || "",
      // ^common params
      //filteredServsIDList: filtered_services_id_list || [],
      //currTokId: curr_token.id || "",
      servingTime: curr_serv_time_HrMinSec || "",
      tokenStatus: "Served",
      //localTimeNow: new Date(),
      //currDayUnixTSMaxVal: curr_day_unixts_max_val || "",
      timeZone: time_zone || "",
      callBasedOnServDate: call_based_on_service_date,
      recalledToken: tokenForRecall.id,
    };

    let c4Result = await callApiHandleCounterRun({ params });
    console.log("c4Result", c4Result);
  };

  /* 6. Check Service working hours for ALL filtered service ids in counter (based on "services_filtered_id_list")
                                       OR ALL serving service ids in counter (based on "serving_services_id_list")
          to add/remove all Tokens for that service from call list accordingly */
  const checkServIDWorkHours = (e) => {
    console.log("running (checkServIDWorkHours()__");

    //TESTING_ONLY //right now this service id , "e" => "e9728810-6ed8-11ea-94ef-a5c6d2d68f9c" has two slots for Saturday
    Firebase.firestore()
      .collection("Services")
      .doc(e)
      .get()
      .then((d) => {
        var CurrentTimeISWorkingHours = false;
        var currentHHmm = 0,
          currentHHSplit = "",
          currentHH = 0,
          currentmm = 0,
          currentHHmmSumSec = 0;
        var callStartHHmm = 0,
          callStartHHSplit = "",
          callStartHH = 0,
          callStartmm = 0,
          callStartHHmmSumSec = 0;
        var callEndHHmm = 0,
          callEndHHSplit = "",
          callEndHH = 0,
          callEndmm = 0,
          callEndHHmmSumSec = 0;

        let TimeZone2 = d.data().TimeZone;
        let TimeZoneParts = TimeZone2.split(")");
        let timeZoneCurrent = TimeZoneParts[1];

        //var timeZoneCurrent = d.data().TimeZone; //d.data().TimeZone; //b.time_zone; // "(UTC+05:00)Indian/Maldives" ().TimeZone",b.docs().TimeZone);
        var weekDayForCurrentTimeZone = moment(new Date())
          .tz(timeZoneCurrent)
          .format("dddd"); //output format: "Thursday"
        var ServiceDays = d.data().Service_Days || 0; //d.data().Service_Days; //b.service_days;
        var ServiceDaysLength = ServiceDays.length;

        if (
          ServiceDays != null &&
          ServiceDays != "" &&
          ServiceDays != undefined &&
          ServiceDaysLength >= 1
        ) {
          //&& d.id == "e9728810-6ed8-11ea-94ef-a5c6d2d68f9c"){
          var i = 0;
          while (CurrentTimeISWorkingHours == false && i < ServiceDaysLength) {
            if (ServiceDays[i].week_day === weekDayForCurrentTimeZone) {
              //for eg: this will only loop through "Saturday" elements only

              currentHHmm = moment(new Date())
                .tz(timeZoneCurrent)
                .format("HH:mm")
                .toString(); //output format: "19:40" for 7:40pm in 24hr format
              currentHHSplit = currentHHmm.split(":");
              currentHH = parseInt(currentHHSplit[0], 10); //output format: HH
              currentmm = parseInt(currentHHSplit[1], 10); //output format: mmoutput format: mm
              currentHHmmSumSec = parseInt(currentHH * 60 + currentmm * 1, 10); //output format: s

              callStartHHmm = ServiceDays[i].call_start_time.toString(); //moment(new Date()).tz(timeZoneCurrent).format("HH:mm");
              callStartHHSplit = callStartHHmm.split(":");
              callStartHH = parseInt(callStartHHSplit[0], 10); //output format: HH
              callStartmm = parseInt(callStartHHSplit[1], 10); //output format: mm
              callStartHHmmSumSec = parseInt(
                callStartHH * 60 + callStartmm * 1,
                10
              ); //output format: s

              callEndHHmm = ServiceDays[i].call_end_time.toString(); //moment(new Date()).tz(timeZoneCurrent).format("HH:mm");
              callEndHHSplit = callEndHHmm.split(":");
              callEndHH = parseInt(callEndHHSplit[0], 10); //output format: HH
              callEndmm = parseInt(callEndHHSplit[1], 10); //output format: mm
              callEndHHmmSumSec = parseInt(callEndHH * 60 + callEndmm * 1, 10); //output format: s

              if (
                //TESTING_ONLY firdous urgent
                currentHHmmSumSec > callStartHHmmSumSec &&
                currentHHmmSumSec < callEndHHmmSumSec
              ) {
                //--> WITHIN CALL_START_TIME AND CALL_END_TIME RANGE
                CurrentTimeISWorkingHours = true;
                return true; //TESTING_ONLY
              } /*if (currentHHmmSumSec < callStartHHmmSumSec || currentHHmmSumSec > callEndHHmmSumSec)*/ else {
                //--> NOT WITHIN CALL_START_TIME AND CALL_END_TIME RANGE
                CurrentTimeISWorkingHours = false;
                return false;
              }
            }
            i++;
          }

          if (CurrentTimeISWorkingHours == true) {
            var tempNotWorkingServIDs1 = [...temp_disabled_working_serv_ids];
            console.log("tempNotWorkingServIDs1 COPYA", tempNotWorkingServIDs1);
            if (tempNotWorkingServIDs1 != "undefined") {
              for (var h = 0; h < tempNotWorkingServIDs1.length; h++) {
                if (tempNotWorkingServIDs1[hour_val] === e) {
                  tempNotWorkingServIDs1.splice(hour_val, 1);
                }
              }
              set_temp_disabled_working_serv_ids(tempNotWorkingServIDs1);
            }
            console.log(
              "...temp_disabled_working_serv_ids COPYA",
              ...temp_disabled_working_serv_ids
            );
            console.log(
              "NEW mappedServceIds && workingHours FALSE .. for service e",
              e
            );
            return true;
          } else if (CurrentTimeISWorkingHours == false) {
            var tempNotWorkingServIDs2 = [...temp_disabled_working_serv_ids];
            console.log("tempNotWorkingServIDs2 COPYB", tempNotWorkingServIDs2);
            if (tempNotWorkingServIDs2 != "undefined") {
              if (tempNotWorkingServIDs2.includes(e) == false) {
                tempNotWorkingServIDs2.push(e);
                set_temp_disabled_working_serv_ids(tempNotWorkingServIDs2);
              }
            }
            console.log(
              "...temp_disabled_working_serv_ids COPYB",
              ...temp_disabled_working_serv_ids
            );
            console.log(
              "NEW mappedServceIds && workingHours FALSE .. for service e",
              e
            );
            return false;
          }
        } else {
          CurrentTimeISWorkingHours = true;

          var tempNotWorkingServIDs3 = [...temp_disabled_working_serv_ids];
          console.log("tempNotWorkingServIDs3 COPYC", tempNotWorkingServIDs3);
          if (tempNotWorkingServIDs3 != "undefined") {
            if (tempNotWorkingServIDs3.includes(e) == false) {
              for (var j = 0; j < tempNotWorkingServIDs3.length; j++) {
                if (tempNotWorkingServIDs3[j] === e) {
                  tempNotWorkingServIDs3.splice(j, 1);
                }
              }
              set_temp_disabled_working_serv_ids(tempNotWorkingServIDs3);
            }
          }
          console.log(
            "...temp_disabled_working_serv_ids COPYC",
            ...temp_disabled_working_serv_ids
          );
          console.log(
            "NEW mappedServceIds && workingHours FALSE .. for service e",
            e
          );
          return true;
        }
      });
  };

  //handleChangeCounterState(e) {
  //   console.log("handleChangeCounterState()", e.value)
  //   Firebase.firestore().collection("Counters").doc(counter_id).update({
  //       Counter_State: e.value
  //   }).then(() => { //console.log("success!")
  //   }).catch((error) => { console.error("update_query_error11: ", error)})
  //}

  //handleChangeCounterState = (newValue, actionMeta) => {
  //   let customer_id = JSON.parse(localStorage.getItem("auth_info")).customer_id
  //   console.group("Value Changed")
  //   console.log(newValue)
  //   console.log(`action: ${actionMeta.action}`)
  //   console.groupEnd()

  //   if (actionMeta.action == "select-option") {

  //       const { __isNew__, value } = newValue
  //       console.log("__isNew__", __isNew__)

  //       let custom_counter_states = custom_counter_states
  //       if (custom_counter_states.includes(value) === false) {
  //           custom_counter_states.push(value)
  //       }
  //       console.log("custom_counter_states", custom_counter_states)
  //       console.log("default_counter_states", default_counter_states)

  //       if (__isNew__ === true) {
  //           console.log("taking __isNew__ path")
  //           Firebase.firestore().collection("System_Config")
  //           .doc("Counter_States").collection("Custom_Counter_States_Collection")
  //           .doc(customer_id).update({
  //               Custom_Counter_States: custom_counter_states
  //           }).then(() => { //console.log("success!")

  //               Firebase.firestore().collection("Counters").doc(counter_id).update({
  //                   Counter_State: value
  //               }).then(() => { //console.log("success!")
  //                   set_counter_state({ label: value , value: value } })
  //               }).catch((error) => { console.error("update_query_error11b: ", error)})
  //           }).catch((error) => { console.error("update_query_error11a: ", error)})

  //       } else {
  //           console.log("taking __isNew__ false path")
  //           Firebase.firestore().collection("Counters").doc(counter_id).update({
  //               Counter_State: value
  //           }).then(() => { //console.log("success!")
  //               set_counter_state({ label: value , value: value } })
  //           }).catch((error) => { console.error("update_query_error11c: ", error)})
  //       }

  //   } else if (actionMeta.action == "clear") {
  //       console.log("taking clear path")
  //       Firebase.firestore().collection("Counters").doc(counter_id).update({
  //           Counter_State: default_counter_state
  //       }).then(() => { //console.log("success!")
  //           set_counter_state({ label: default_counter_state , value: default_counter_state } })
  //       }).catch((error) => { console.error("update_query_error11d: ", error)})

  //   }
  //}

  const handleChangeCounterState = async (newValue, actionMeta) => {
    let customer_id = JSON.parse(localStorage.getItem("auth_info")).customer_id;

    let counterStateCharLimit = counter_state_char_limit;
    let defaultCounterState = default_counter_state;
    let defaultCounterStates = default_counter_states; //TESTING_ONLY
    let customCounterStates = custom_counter_states; //TESTING_ONLY
    let customCounterStatesValues = customCounterStates.map((prop, key) => {
      return prop.value;
    });
    let combinedCounterStates = combined_counter_states; //TESTING_ONLY
    let combinedCounterStatesValues = combinedCounterStates.map((prop, key) => {
      return prop.value;
    });

    console.group("Value Changed");
    console.log(newValue);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();

    //console.log("newValue", newValue, "actionMeta.action", actionMeta.action)

    console.log("defaultCounterStates", defaultCounterStates);
    console.log("customCounterStates", customCounterStates);
    console.log("customCounterStatesValues", customCounterStatesValues);
    console.log("combinedCounterStates", combinedCounterStates);
    console.log("combinedCounterStatesValues", combinedCounterStatesValues);

    //-- so will move that section to the cloud fucntion file, new means new value, else update the counter value
    if (newValue) {
      const { __isNew__, value } = newValue;

      if (__isNew__ === true) {
        if (combinedCounterStatesValues.includes(value) === false) {
          if (value.length <= counterStateCharLimit) {
            console.log("taking __isNew__ TRUE path1");
            combinedCounterStates.push({ label: value, value: value });
            combinedCounterStatesValues.push(value);
            customCounterStatesValues.push(value);
            set_combined_counter_states(combinedCounterStates);

            set_counter_state({ label: value, value: value });

            console.log("customCounterStatesValues", customCounterStatesValues);

            let params = {
              version: "1",
              cmd_: "C6",
              // apiKey: api_key || "",
              customerId: customer_id || "",
              // mainLocId: main_location_id || "",
              subLocId: sub_location_id || "",
              // serviceId: service_id || "",
              counterId: counter_id || "",
              emailId: email || "",
              userId: email || "",
              userName: user_name || "",
              // ^common params
              value: value,
              customCounterStatesValues: customCounterStatesValues,
              newVal: "1",
            };

            let c6Result = await callApiHandleCounterRun({ params });
            console.log("c6Result", c6Result);
          } else {
            notifyMessage(
              "tc",
              3,
              `Sorry, new "Counter State" text must less than ${counterStateCharLimit} chars!`
            );
          }
        } else {
          //do nothing, this part doesn"t execute anyway due to ui validation
          console.log("taking __isNew__ TRUE path2");
        }
      } else {
        console.log("taking __isNew__ FALSE path");

        set_counter_state({ label: value, value: value });

        let params = {
          version: "1",
          cmd_: "C6",
          // apiKey: api_key || "",
          customerId: customer_id || "",
          // mainLocId: main_location_id || "",
          subLocId: sub_location_id || "",
          // serviceId: service_id || "",
          counterId: counter_id || "",
          emailId: email || "",
          userId: email || "",
          userName: user_name || "",
          // ^common params
          value: value,
          newVal: "0",
          customCounterStatesValues: customCounterStatesValues,
        };

        let c6Result = await callApiHandleCounterRun({ params });
        // console.log("c6Result", c6Result);
      }
    } else {
      console.log("taking actionMeta.action == 'clear' path");

      set_counter_state({
        label: defaultCounterState,
        value: defaultCounterState,
      });
      let params = {
        version: "1",
        cmd_: "C6",
        // apiKey: api_key || "",
        customerId: customer_id || "",
        // mainLocId: main_location_id || "",
        subLocId: sub_location_id || "",
        // serviceId: service_id || "",
        counterId: counter_id || "",
        emailId: email || "",
        userId: email || "",
        userName: user_name || "",
        // ^common params
        value: defaultCounterState,
        newVal: "0",
        customCounterStatesValues: customCounterStatesValues,
      };

      let c6Result = await callApiHandleCounterRun({ params });
      // console.log("c6Result", c6Result);
    }
  };

  const handleFilters = (filterdServList) => {
    console.log("running handleFilters()__ filterdServList", filterdServList); //TESTING_FUNCTIONAL
    let now = new Date();
    let currFirestoreTS = Firebase.firestore.FieldValue.serverTimestamp(); //new Date();
    Firebase.firestore()
      .collection("Counters")
      .doc(counter_id)
      .update({
        Filtered_Services: services_list
          ?.map((e) => e?.id)
          ?.filter((e) => filterdServList?.includes(e)),
        Last_Updated_Firestore_Timestamp: currFirestoreTS,
        Updated_Date: now,
        Blink: false,
      })
      .then(() => {
        //console.log("success!");
      })
      .catch((error) => {
        console.error("handleFilters error: ", error);
      });
  };

  // //TESTING_ONLY
  // const callApiHandleCounterRun111 = (e) => {
  //   let currentUser = Firebase.auth().currentUser;
  //   currentUser.getIdToken().then(function (token) {
  //     //console.log("token", token);

  //     const requestOptions = {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     };

  //     let fullBaseURL = functions_base_url + "apiHandleCounterRun";
  //     console.log("functions_base_url fullBaseURL", fullBaseURL); //TESTING_ONLY firdous
  //     let url = new URL(fullBaseURL),
  //       params = {
  //         version: "1",
  //         cmd_: "C1",
  //         // apiKey: api_key || "",
  //         customerId: customer_id || "",
  //         // mainLocId: main_location_id || "",
  //         subLocId: sub_location_id || "",
  //         // serviceId: service_id || "",
  //         counterId: counter_id || "",
  //         emailId: email || "",
  //         userId: email || "",
  //         userName: user_name || "",
  //         // ^common params
  //         //filteredServsIDList: filtered_services_id_list || [],
  //         //currTokId: curr_token.id || "",
  //         servingTime: curr_serv_time_HrMinSec || "",
  //         tokenStatus: "Served",
  //         //localTimeNow: new Date(),
  //         //currDayUnixTSMaxVal: curr_day_unixts_max_val || "",
  //         timeZone: time_zone || "",
  //         callBasedOnServDate: call_based_on_service_date,
  //       };
  //     Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));
  //     fetch(url, requestOptions)
  //       .then((response) => response.json())
  //       .then((tokenData) => {
  //         showSuccessfulNewToken(tokenData);
  //       })
  //       .catch(function (error) {
  //         set_loading(false);
  //         notifyMessage("tc", 3, "Network error!");
  //         console.log("callApiHandleCounterRun NetworkError==>", error);
  //       });
  //   });
  // };

  const callApiHandleCounterRun = (e) => {
    if (e.params.cmd_ != "C8") set_loading(true);
    let currentUser = Firebase.auth().currentUser;
    return currentUser.getIdToken().then(function (token) {
      // Firebase.functions().httpsCallable('apiHandleCounterRun')({email: email, subject: 'Welcome to Antqueue Web App', text: "text"}).then(function(result) {
      //     console.log(result);
      // });
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      let fullBaseURL = functions_base_url + "apiHandleCounterRun";
      // let fullBaseURL = 'http://127.0.0.1:5001/antqueuetest-ce4e9/us-central1/' + "apiHandleCounterRun";
      // let fullBaseURL = functions_base_url + "apiGenerateTokenForWebInterface";
      // console.log("functions_base_url fullBaseURL", fullBaseURL, "token", token); //TESTING_ONLY firdous
      // console.log({ params: params });

      // console.log("running api 1 - started");

      let url = new URL(fullBaseURL),
        params = e.params;
      params.userId = currentUser.uid;

      //TESTING_ONLY firdous urgent
      Object.keys(params).forEach(function (key) {
        url.searchParams.append(key, params[key]);
        // console.log(key, params[key]);
      });

      // Object.keys(params).forEach((key) =>
      //   url.searchParams.append(key, params[key])
      //   console.log(key, params[key])
      // );

      return fetch(url, requestOptions)
        .then((response) => response.json())
        .then((res) => {
          //showNextCalledToken(res);
          //showSuccessfulNewToken(res);

          //"C1";
          // console.log("counter api call res", res);

          if (res.status == "success") {
            let notify_message_methods = ["noPendingToks"];
            // only show success messages for these operations
            if (notify_message_methods.includes(res.method)) {
              // notifyMessage("tc", 2, res.message);
              notifyMessage("tc", 4, res.message);
            }
            console.log("counter api call res", res);
          } else if (res.status == "failed") {
            notifyMessage("tc", 3, res.message);
            console.error("counter api call res", res);
          }
          // console.log(
          //   "curr_token2",
          //   "after_calling_gcf",
          //   curr_token /*"newDate", newDate, "currentHour", currentHour, "currentMinute", currentMinute, "genHour", genHour, "genMinute", genMinute, "waitingtime", waitingtime, "waitingtime2", waitingtime2, "currTimestamp", currTimestamp,*/,
          //   "curr_token.takenatunixtimestamp",
          //   curr_token.takenatunixtimestamp
          // );
          set_loading(false);
          //   res= await res
          return res;
        })
        .catch(function (error) {
          set_loading(false);
          notifyMessage("tc", 3, "Encountered an error!");
          console.log("callApiHandleCounterRun error", error);
        });

      // console.log("running api 2 - done");
    });
  };

  const handleNoShowToken = async () => {
    set_loading(true);

    let params = {
      version: "1",
      cmd_: "C2",
      // apiKey: api_key || "",
      customerId: customer_id || "",
      // mainLocId: main_location_id || "",
      subLocId: sub_location_id || "",
      // serviceId: service_id || "",
      counterId: counter_id || "",
      emailId: email || "",
      userId: email || "",
      userName: user_name || "",
      // ^common params
      //filteredServsIDList: filtered_services_id_list || [],
      //currTokId: curr_token.id || "",
      servingTime: curr_serv_time_HrMinSec || "",
      tokenStatus: "No_Show",
      //localTimeNow: new Date(),
      //currDayUnixTSMaxVal: curr_day_unixts_max_val || "",
      timeZone: time_zone || "",
      callBasedOnServDate: call_based_on_service_date,
    };

    let c2Result = await callApiHandleCounterRun({ params });
    // console.log("c2Result", c2Result);
    //callApiHandleCounterRun("No_Show"); //TESTING_ONLY firdous
  };

  // const caution_DelTestRecords = () = > {
  //   var i = 0, j = 0;
  //   ////1Firebase.firestore().collection('Token_Details')
  //   .where('Customer_ID', '==', '000000000001')
  //   .limit(100).get().then(q => {
  //       q.docs.forEach(t => {
  //           //var ts = (t.data().Created_Date.toDate().getTime());
  //           //if (ts >= 1599750000000) {
  //               console.log("TokenID", t.id,  "Token_Number_String", t.data().Token_Number_String);
  //               ////1Firebase.firestore().collection('Token_Details').doc(t.id).delete();
  //               i++;
  //           //}
  //           // else {
  //           //     console.log('t.id 2', t.id);
  //           //     j++;
  //           // }
  //       });
  //   })
  //   .then(() => {
  //       console.log("i++: ",i);
  //       // console.log("j++: ", j);
  //   })
  // }

  const closeCounter = async (exitPoint = 0) => {
    console.log("running closeCounter()__");
    console.log({
      sub_location_id: sub_location_id,
      curr_serv_time_HrMinSec: curr_serv_time_HrMinSec,
      time_zone: time_zone,
      call_based_on_service_date: call_based_on_service_date,
      exitPoint: exitPoint,
    });

    set_loading(true);
    if (counter_id != undefined && counter_id != "" && counter_id.length > 0) {
      let params = {};
      if (exitPoint === "via_handle_close_counter") {
        params = {
          version: "1",
          cmd_: "C5",
          // apiKey: api_key || "",
          customerId: customer_id || "",
          mainLocId: main_location_id || "",
          subLocId: sub_location_id || "",
          // serviceId: service_id || "",
          counterId: counter_id || "",
          emailId: email || "",
          userId: email || "",
          userName: user_name || "",
          // ^common params
          //filteredServsIDList: filtered_services_id_list || [],
          //currTokId: curr_token.id || "",
          servingTime: curr_serv_time_HrMinSec || "",
          tokenStatus: "Served",
          //localTimeNow: new Date(),
          //currDayUnixTSMaxVal: curr_day_unixts_max_val || "",
          timeZone: time_zone || "",
          callBasedOnServDate: call_based_on_service_date,
        };
      } else {
        params = {
          version: "1",
          cmd_: "C5",
          // apiKey: api_key || "",
          customerId: customer_id || "",
          mainLocId: main_location_id || "",
          subLocId: sub_location_id || "",
          // serviceId: service_id || "",
          counterId: counter_id || "",
          emailId: email || "",
          userId: email || "",
          userName: user_name || "",
          // ^common params
          //filteredServsIDList: filtered_services_id_list || [],
          //currTokId: curr_token.id || "",
          // servingTime: curr_serv_time_HrMinSec || "",
          // tokenStatus: "Served",
          //localTimeNow: new Date(),
          //currDayUnixTSMaxVal: curr_day_unixts_max_val || "",
          // timeZone: time_zone || "",
          // callBasedOnServDate: call_based_on_service_date,
        };
      }

      let c5Result = await callApiHandleCounterRun({ params });
      console.log("c5Result", c5Result);
      // callApiHandleCounterRun({ params }).then(() => {
      //   goBack();
      // });
    } else {
      goBack();
    }
  };

  const goBack = () => {
    setTimeout(() => {
      props.history.push("/counters");
    }, 1000);
  };

  const closeToken = (tokId) => {
    console.log("running closeToken()__tokId", tokId);
    var currFirestoreTS = Firebase.firestore.FieldValue.serverTimestamp(); //new Date();
    if (tokId != undefined && tokId !== "" && tokId.length > 0) {
      Firebase.firestore()
        .collection("Token_Details")
        .doc(tokId)
        .update({
          Token_Status: "Closed",
          Record_Status: "Inactive",
          Last_Updated_Firestore_Timestamp: currFirestoreTS,
        })
        .then(() => {
          console.log("success! closed tokId", tokId); //TESTING_FUNCTIONAL
        })
        .catch((error) => {
          console.error("update_query_error 2,3,9,10: ", error);
        });
    }
  };

  /* 8. handleCloseCounter-------------------------------------------------------------------*/
  const handleCloseCounter = () => {
    // var now = new Date()
    // var currTimestamp = Math.floor(now.getTime() / 1000)
    closeCounter("via_handle_close_counter");
  };

  const handleRepeatToken = async () => {
    console.log("running handleRepeatToken()__ curr_token", curr_token);
    let currTokNum = curr_token.number || -1;
    if (currTokNum !== -1) {
      // Firebase.functions().useFunctionsEmulator("http://localhost:5000")
      let params = {
        version: "1",
        cmd_: "C3",
        // apiKey: api_key || "",
        customerId: customer_id || "",
        // mainLocId: main_location_id || "",
        subLocId: sub_location_id || "",
        // serviceId: service_id || "",
        counterId: counter_id || "",
        emailId: email || "",
        userId: email || "",
        userName: user_name || "",
        // ^common params
        tokenId: curr_token.id || "",
      };

      let c3Result = await callApiHandleCounterRun({ params });
      console.log("c3Result", c3Result);
    } else {
      notifyMessage("tc", 3, "No token currently loaded!");
    }
  };

  const handleRecallToken = () => {
    loadTokenDetails(); //TESTING_ONLY
  };

  const toggleModalClassic = (/*title, body*/) => {
    set_loading(false);
    //set_modalTitle(title);
    //set_modalBody(body);
    set_modal_classic(!modal_classic); //TESTING_ONLY //firdous
  };

  const generateNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  ///**
  //* Sorts an array of objects by column/property.
  //* @param {Array} array - The array of objects.
  //* @param {object} sortObject - The object that contains the sort order keys with directions (asc/desc). e.g. { age: "desc", name: "asc" }
  //* @returns {Array} The sorted array.
  //*/
  const multiSort = (array, sortObject = {}) => {
    const sortKeys = Object.keys(sortObject);
    //Return array if no sort object is supplied.
    if (!sortKeys.length) {
      return array;
    }
    //Change the values of the sortObject keys to -1, 0, or 1.
    for (let key in sortObject) {
      sortObject[key] =
        sortObject[key] === "desc" || sortObject[key] === -1
          ? -1
          : sortObject[key] === "skip" || sortObject[key] === 0
          ? 0
          : 1;
    }
    const keySort = (a, b, direction) => {
      direction = direction !== null ? direction : 1;
      if (a === b) {
        //If the values are the same, do not switch positions.
        return 0;
      }
      //If b > a, multiply by -1 to get the reverse direction.
      return a > b ? direction : -1 * direction;
    };
    return array.sort((a, b) => {
      let sorted = 0;
      let index = 0;
      //Loop until sorted (-1 or 1) or until the sort keys have been processed.
      while (sorted === 0 && index < sortKeys.length) {
        const key = sortKeys[index];
        if (key) {
          const direction = sortObject[key];

          sorted = keySort(a[key], b[key], direction);
          index++;
        }
      }
      return sorted;
    });
  };

  const loadTokenDetails = async (tokSearchNum) => {
    //let token_details_list = [];
    let i = 0;

    let startDateFmt = start_date_formatted;
    let endDateFmt = end_date_formatted;
    // startDateFmt = startDateFmt; //parseInt(moment(startDateFmt, "YYYY-MM-DD").unix());
    // endDateFmt = endDateFmt; //parseInt(moment(endDateFmt, "YYYY-MM-DD").unix()) + 86400; //number of seconds in a day
    console.log("startDateFmt", startDateFmt, "endDateFmt", endDateFmt);

    let selectedMainLocId = main_location_id;
    let selectedSubLocId = sub_location_id;
    let selectedServingServIds = serving_services_id_list;
    //let selected_token_statuses = selected_token_statuses;

    if (
      selectedMainLocId !== null &&
      selectedSubLocId !== null &&
      selectedServingServIds !== null &&
      selectedServingServIds.length > 0
    ) {
      // console.log({
      //   startDateFmt: startDateFmt,
      //   endDateFmt: endDateFmt,
      //   customer_id: customer_id,
      //   selectedMainLocId: selectedMainLocId,
      //   selectedSubLocId: selectedSubLocId,
      //   selectedServingServIds: selectedServingServIds,
      // });
      //let selectedTokStatuses = selected_token_statuses.map((prop,key) => { return prop.value });

      let response;

      let params = {
        version: "1",
        cmd_: "C7",
        // apiKey: api_key || "",
        customerId: customer_id || "",
        mainLocId: main_location_id || "",
        subLocId: sub_location_id || "",
        // serviceId: service_id || "",
        counterId: counter_id || "",
        emailId: email || "",
        userId: email || "",
        userName: user_name || "",
        // ^common params
        startDateFmt: startDateFmt,
        endDateFmt: endDateFmt,
        // selectedMainLocId: selectedMainLocId,
        // selectedSubLocId: selectedSubLocId,
        tokSearchNum: tokSearchNum || "",
        selectedServingServIds: selectedServingServIds,
      };

      // callApiHandleCounterRun({ params }).then((e) => {
      //   if (e != undefined && e.result != undefined) {
      //     console.log(e.result);
      //     set_token_details_list([]);
      //     set_token_details_list(e.result);
      //     set_loading(false);
      //     if (tokSearchNum == "" || tokSearchNum == undefined || tokSearchNum == null) {
      //       toggleModalClassic();

      //       //no action to be taken (modal already visible)
      //     } else {
      //       //show modal
      //       // toggleModalClassic(modalTitle1, modalBody1); //TESTING_ONLY firdous urgent
      //     }
      //   }
      // });

      let c3Result = await callApiHandleCounterRun({ params });
      // console.log("c3Result", c3Result);

      // callApiHandleCounterRun({ params }).then((e) => {
      if (c3Result != undefined && c3Result.result != undefined) {
        console.log(c3Result.result);
        set_token_details_list([]);
        set_token_details_list(c3Result.result);
        set_loading(false);
        if (
          tokSearchNum == "" ||
          tokSearchNum == undefined ||
          tokSearchNum == null
        ) {
          toggleModalClassic();

          //no action to be taken (modal already visible)
        } else {
          //show modal
          // toggleModalClassic(modalTitle1, modalBody1); //TESTING_ONLY firdous urgent
        }
      }
      // });

      //   var query = Firebase.firestore().collection("Token_Details");
      //   query = query
      //     .where("Created_Datetime_Unix_Timestamp", ">=", startDateFmt)
      //     .where("Created_Datetime_Unix_Timestamp", "<=", endDateFmt)
      //     .where("Customer_ID", "==", customer_id)
      //     .where("Main_Location_ID", "==", selectedMainLocId)
      //     .where("Sub_Location_ID", "==", selectedSubLocId);

      //   if (
      //     tokSearchNum !== "" &&
      //     tokSearchNum !== undefined &&
      //     tokSearchNum !== null
      //   ) {
      //     //TESTING_ONLY 1+1==2
      //     query = query.where("Token_Number_String", "==", tokSearchNum);
      //   } else {
      //     //no further where condition needed
      //   }

      //   const tokDetails = await query
      //     .get()
      //     .then(snapshot => {
      //       if (snapshot.empty) {
      //         return;
      //       }

      //       let token_details_list = [];
      //       console.log("snapshot.length", snapshot.length);

      //       snapshot.forEach(tok => {
      //         if (
      //           tok.data().Token_Status !== "Pending" &&
      //           tok.data().Token_Status !== "Pending_Approval" &&
      //           selectedMainLocId === tok.data().Main_Location_ID &&
      //           selectedSubLocId === tok.data().Sub_Location_ID &&
      //           selectedServingServIds.includes(tok.data().Services_ID)
      //           //&& selectedTokStatuses.includes(tok.data().Token_Status)
      //         ) {
      //           console.log({
      //             selectedMainLocId: selectedMainLocId,
      //             selectedSubLocId: selectedSubLocId,
      //             selectedServingServIds: selectedServingServIds,
      //             //selectedTokStatuses: selectedTokStatuses,
      //             "tok.data().Main_Location_ID": tok.data().Main_Location_ID,
      //             "tok.data().Sub_Location_ID": tok.data().Sub_Location_ID,
      //             "tok.data().Services_ID": tok.data().Services_ID,
      //             "tok.data().Token_Status": tok.data().Token_Status,
      //             "tok.data().Request_Approval_Group_Profile_Id":
      //               tok.data().Request_Approval_Group_Profile_Id,
      //           });

      //           const option = {
      //             token_detail_id: tok.id,
      //             id: tok.id,
      //             value: tok.id,
      //             customer_id: tok.data().Customer_ID,
      //             created_datetime: tok.data().Created_Datetime,
      //             created_datetime_ts: tok.data().Created_Datetime_Unix_Timestamp,
      //             requested_datetime: tok.data().Requested_Datetime,
      //             requested_datetime_ts: tok.data().Requested_Datetime_Unix_Timestamp,
      //             service_datetime: tok.data().Service_Datetime,
      //             start_serving_time: tok.data().StartServing_time,
      //             service_datetime_formatted: moment(
      //               new Date(
      //                 parseInt(tok.data().Service_Datetime_Unix_Timestamp) * 1000
      //               )
      //             )
      //               .tz(tok.data().TimeZone)
      //               .format("YYYY-MM-DD"),
      //             service_datetime_ts: tok.data().Service_Datetime_Unix_Timestamp,
      //             internal_response: tok.data().Internal_Response,
      //             service_type: tok.data().Service_Type,
      //             start_char: tok.data().Start_Character,
      //             input_source: tok.data().Input_Source,
      //             main_location_id: tok.data().Main_Location_ID,
      //             sub_location_id: tok.data().Sub_Location_ID,
      //             serv_id: tok.data().Services_ID,
      //             main_loc_nam: tok.data().Main_Location_Name,
      //             sub_loc_nam: tok.data().Sub_Location_Name,
      //             serv_name: tok.data().Service_Name,
      //             serv_start_date: tok.data().Service_Start_Datetime,
      //             token_num: tok.data().Token_Number_String,
      //             token_status: tok.data().Token_Status,
      //             waiting_time: tok.data().Waiting_Time,
      //             mau_id: tok.data().Mobile_App_User_ID,
      //             mau_contact: tok.data().Mobile_App_User_Contact,
      //             mau_email: tok.data().Mobile_App_User_Email,
      //             mau_name: tok.data().Mobile_App_User_Name,
      //             time_zone: tok.data().TimeZone,
      //             new_tok_ref_id: tok.data().New_Token_Reference_ID,
      //             new_tok_ref_num: tok.data().New_Token_Reference_Num,
      //             cancelled_tok_ref_id: tok.data().Cancelled_Token_Reference_ID,
      //             cancelled_tok_ref_num: tok.data().Cancelled_Token_Reference_Num,
      //             new_tok_ref_prev_tok_cancelled_reason: tok.data().Cancelled_Reason,
      //             input_fields: tok.data().Mobile_App_Input_Fields,
      //             file_attachments: tok.data().Mobile_App_File_Attachments
      //             //label: Name,
      //           }
      //           token_details_list.push(option);
      //         }
      //       });

      // //multiSort(token_details_list,{ name: "asc" });
      //   set_token_details_list([])
      //   set_token_details_list(token_details_list)
      //   set_loading(false)
      // console.log("token_details_list", token_details_list);
      // console.log("reached here #5 done");

      //   if (
      //     tokSearchNum !== '' &&
      //     tokSearchNum !== undefined &&
      //     tokSearchNum !== null
      //   ) {
      //     //no action to be taken (modal already visible)
      //   } else {
      //     //show modal
      //     toggleModalClassic()
      //     // toggleModalClassic(modalTitle1, modalBody1); //TESTING_ONLY firdous urgent
      //   }
      // })
      // .catch(function (error) {
      //   console.log(`Encountered error: ${error}`)
      // })
    } else if (selectedMainLocId === null || selectedSubLocId === null) {
      notifyMessage(
        "tc",
        3,
        "Main location or Sub location not correctly loaded!"
      );
      set_loading(false);
      console.log({
        selectedMainLocId: selectedMainLocId,
        selectedSubLocId: selectedSubLocId,
        selectedServingServIds: selectedServingServIds,
        selected_servicesLength: selectedServingServIds.length,
      });
    } else if (
      selectedServingServIds === null ||
      typeof selectedServingServIds.length === "undefined" ||
      selectedServingServIds.length <= 0
    ) {
      notifyMessage(
        "tc",
        3,
        "You must set Serving Services so as to include those services in the search!"
      );
      set_loading(false);
      console.log({
        selectedMainLocId: selectedMainLocId,
        selectedSubLocId: selectedSubLocId,
        selectedServingServIds: selectedServingServIds,
        selected_servicesLength: selectedServingServIds.length,
      });
    }
  };

  const formatTokenStatus = (str) => {
    var splitStr = str.toLowerCase().split("_");
    for (var i = 0; i < splitStr.length; i++) {
      //for (var i = 0, len = splitStr.length; i < len i++) {
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(" ");
  };

  const renderFormatTokenStatusComponent = async (str) => {
    var splitStr = str.toLowerCase().split("_");
    for (var i = 0; i < splitStr.length; i++) {
      //for (var i = 0, len = splitStr.length; i < len i++) {
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(" ");
  };

  useEffect(() => {
    getTokenDetails();
  }, [modal_classic]);

  const getTokenDetails = () => {
    let data = [];
    if (typeof token_details_list == "object")
      token_details_list.map((prop, key) => {
        let inputSource = "";
        if (prop.input_source === "Android_Dispenser_API") {
          inputSource = "Dispenser";
        } else if (prop.input_source === "Mobile_App") {
          inputSource = "Mobile";
        } else if (prop.input_source === "Web_Interface") {
          inputSource = "Web";
        }

        let input_source_content;
        if (
          prop.input_source === "Android_Dispenser_API" ||
          prop.input_source === "Web_Interface"
        ) {
          input_source_content = (
            <span className="badge badge-pill badge-info">{inputSource}</span>
          );
        } else {
          input_source_content = (
            <span className="badge badge-pill badge-success">
              {inputSource}
            </span>
          );
        }

        let mau_details_content;
        if (
          typeof prop.mau_id !== "undefined" &&
          prop.mau_id !== null &&
          prop.mau_id !== ""
        ) {
          mau_details_content =
            prop.mau_name + " / " + prop.mau_email + " / " + prop.mau_contact;
        } else {
          mau_details_content = "N/A";
        }

        let tokStatus = "";
        tokStatus = formatTokenStatus(prop.token_status);

        let tokenStatusComponent;

        if (
          prop.token_status === "Closed" ||
          prop.token_status === "Cancelled" ||
          prop.token_status === "No_show" ||
          prop.token_status === "No_Show" ||
          prop.token_status === "Rejected"
        ) {
          tokenStatusComponent = (
            <span className="badge badge-pill badge-danger">{tokStatus}</span>
          );
        } else {
          if (
            prop.token_status === "Pending" ||
            prop.token_status === "Pending_Approval"
          ) {
            tokenStatusComponent = (
              <span className="badge badge-pill badge-warning">
                {tokStatus}
              </span>
            );
          } else {
            if (
              prop.token_status === "Now_Serving" ||
              prop.token_status === "Approved_Pending_Service"
            ) {
              tokenStatusComponent = (
                <span className="badge badge-pill badge-info">{tokStatus}</span>
              );
            } else {
              if (prop.token_status === "Served") {
                tokenStatusComponent = (
                  <span className="badge badge-pill badge-success">
                    {tokStatus}
                  </span>
                );
              } else {
                tokenStatusComponent = (
                  <span className="badge badge-pill badge-default">
                    {tokStatus}
                  </span>
                );
              }
            }
          }
        }

        let action_content;
        action_content = (
          <Button
            size="xs"
            className="btn btn-primary btn-sm"
            color="danger"
            onClick={() => updateTokenRecall(prop)}
          >
            Recall Token
          </Button>
        );

        data.push({
          num: key + 1,
          id: key + 1,
          serv_name: prop.serv_name,
          token_num: prop.token_num,
          new_tok_ref_num: prop.new_tok_ref_num,
          input_source: input_source_content,
          mau_details: mau_details_content,
          token_status: tokenStatusComponent,
          action: action_content,
        });
      });

    setTokenData(data);
    return data;
  };

  const handleTokenSearch = () => {
    let tokSearchTerm = token_search_term;
    let tokSearchNum = "";
    // console.log("tokSearchTerm.replace(/s/g, '').length", tokSearchTerm.replace(/\s/g, "").length);
    if (
      tokSearchTerm !== undefined &&
      tokSearchTerm.replace(/\s/g, "").length !== 0
    ) {
      tokSearchNum = token_search_term.toString();
    } else {
      tokSearchNum = "";
    }

    // console.log("tokSearchNum", tokSearchNum);
    loadTokenDetails(tokSearchNum);
  };

  const handleTokenSearchClear = () => {
    set_token_search_term("");
  };

  //loadPrintingServices(id) {
  //   console.log("running loadPrintingServices()__id", id);
  //   let printingServicesList = []
  //   set_loading(true);
  //   Firebase.firestore().collection("Counters").doc(id).get().then((doc) => {
  //       doc.data().Serving_Services.forEach(e => {
  //           Firebase.firestore().collection("Services").doc(e).get().then(d => {
  //               if (doc.data().Printing_Services != undefined && ) {
  //                   if (doc.data().Printing_Services.includes(e) == true) {
  //                       printingServicesList.push({ label: d.data().Name, value: e });
  //                   }
  //               }

  //           },
  //           (error) => {
  //               console.log("error6==>", error);
  //           })
  //       })
  //       set_printing_services_id_list(printingServicesList);
  //   })
  //   set_loading(false);
  //}

  // const onFocusPrintServices = (e) => {
  //     //TESTING_ONLY
  //     set_selected_printing_service(e);
  // };

  // const onSelectPrintServices = (e) => {
  //     //TESTING_ONLY
  //     set_selected_printing_service(e);
  //     //console.log("+___selected_printing_service___+", e)
  // };

  const notifyMessage = (place, color, text) => {
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

    if (notifyAlert !== null && notifyAlert.current != null) {
      // notificationAlert.notificationAlert(options);
      notifyAlert.current.notificationAlert(options);
    }
  };
  async function serviceDetUpdate(type = "counter_run") {
    let params = {
        version: "1",
        cmd_: "C8",
        customerId: customer_id || "",
        mainLocId: main_location_id || "",
        subLocId: sub_location_id || "",
        counterId: counter_id || "",
        emailId: email || "",
        userId: email || "",
        userName: user_name || "",
        timeZone: time_zone || "",
        refAction: type,
      },
      c8Result;
    // console.log('check latency', fil1)
    // if (fil1 >= latencyVal) {
    c8Result = await callApiHandleCounterRun({ params });
    // console.log('--------============')
    // set_filterLatency(-1)
    // fil1 = -1
    // console.log('c8Result', c8Result, fil1, filterLatency)
    // }
    // else setTimeout(serviceDetUpdate, 1000)
  }

  const getServices = (e) => {
    //const getServices = () => { //TESTING_ONLY
    /* Render the Services List with Pending Count & button to call Specific Service */
    return services_list.map((prop, key) => {
      return (
        <tr key={key}>
          <td>{prop.name}</td>
          <td>{prop.serv_last_called_tok}</td>
          <td>{prop.pending}</td>
          {call_specific_service == true ? (
            <td>
              <Col
                md="2"
                xs="2"
                data-id={prop.id}
                className="service text-center"
              >
                <Switch //className="left-margin-30"
                  defaultValue={
                    filtered_services_id_list.includes(prop.id) ? true : false
                  } //{false}
                  value={
                    filtered_services_id_list.includes(prop.id) ? true : false
                  }
                  offColor="success"
                  offText="OFF"
                  onColor="success"
                  onText="ON"
                  onChange={(event) => {
                    {
                      /* console.log(prop); */
                    }
                    // console.log(
                    //   "event.state.value",
                    //   event.state.value,
                    //   "filtered_services_id_list",
                    //   filtered_services_id_list
                    // ); //TESTING_FUNCTIONAL
                    var filteredServList = [];
                    if (event.state.value) {
                      filteredServList = [
                        ...filtered_services_id_list,
                        prop.id,
                      ];
                      set_filtered_services_id_list(filteredServList); //TESTING_FUNCTIONAL
                    } else {
                      filteredServList = filtered_services_id_list.filter(
                        (item) => item != prop.id
                      );
                      set_filtered_services_id_list(filteredServList); //TESTING_FUNCTIONAL
                    }

                    // event.state.value
                    //   ? filtered_services_id_list.push(prop.id)
                    //   : (filtered_services_id_list = filtered_services_id_list.filter(
                    //       (item) => item != prop.id
                    //   ));

                    // console.log(
                    //   "filtered_services_id_list",
                    //   filtered_services_id_list,
                    //   "filteredServList",
                    //   filteredServList,
                    //   "prop.id",
                    //   prop.id
                    // ); //TESTING_FUNCTIONAL
                    // if(filterLatency >= latencyVal || filterLatency==-1)
                    serviceDetUpdate();
                    set_filterLatency(0);
                    fil1 = 0;
                    handleFilters(filteredServList);
                  }}
                />
              </Col>
            </td>
          ) : null}
          {generate_token_for_specific_service == true ? (
            <td>
              <Row className="justify-content-md-center" data-id={prop.id}>
                <Button
                  size="xs"
                  className="col-8"
                  color="info"
                  onClick={() => handleGenerateNewTokenNum(prop.id)}
                >
                  NEW TOKEN
                </Button>
                {modify_service_details_for_display == true ? (
                  <ServiceModalBtn
                    service={prop}
                    serviceDetailsForDisplays={sublocationServicesDetails}
                    btnDisabled={!!prop?.serviceDetailsForDisplaysToggle}
                    serviceRef={Firebase.firestore()
                      .collection("Services")
                      .doc(prop?.id)}
                    sublocationRef={Firebase.firestore()
                      .collection("Sub_Locations")
                      .doc(prop?.sub_location_id)}
                    serviceDetUpdate={() => {
                      serviceDetUpdate();
                      set_filterLatency(3);
                      fil1 = 0;
                    }}
                  />
                ) : null}
              </Row>
            </td>
          ) : null}
        </tr>
      );
    });
  };

  const handleGenerateNewTokenNum = (serviceId) => {
    console.log("running handleGenerateNewTokenNum()__ serviceId", serviceId);

    var email = JSON.parse(localStorage.getItem("auth_info")).email;
    //var ApiKey = api_key;

    //let userId = //"rndUsrId";    //UserId            || "";
    let apiKey = 8700077; //"LNBqORi";     //ApiKey            || "";
    //let serviceId = serviceId; //serviceId    || "";
    let subLocId = sub_location_id; //SubLocId          || "";
    let mainLocId = main_location_id; //MainLocId         || "";

    let currentUser = Firebase.auth().currentUser;
    currentUser.getIdToken().then(function (token) {
      //console.log("token", token);

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      let fullBaseURL = functions_base_url + "apiGenerateTokenForWebInterface";
      console.log("functions_base_url fullBaseURL", fullBaseURL);
      console.log({
        EmailId: email,
        ApiKey: apiKey,
        ServiceId: serviceId,
        SubLocId: subLocId,
        MainLocId: mainLocId,
      });
      let url = new URL(fullBaseURL),
        params = {
          EmailId: email,
          ApiKey: apiKey,
          ServiceId: serviceId,
          SubLocId: subLocId,
          MainLocId: mainLocId,
        };
      Object.keys(params).forEach((key) =>
        url.searchParams.append(key, params[key])
      );
      fetch(url, requestOptions)
        .then((response) => response.json())
        .then((tokenData) => {
          showSuccessfulNewToken(tokenData);
        })
        .catch(function (error) {
          set_loading(false);
          notifyMessage("tc", 3, "Network error!");
          console.log("handleGenerateNewTokenNum NetworkError==>", error);
        });
    });
  };

  const showSuccessfulNewToken = (tokenData) => {
    console.log("tokenData", tokenData);
    var newTokenTitle = "";
    if (tokenData.status == "success") {
      newTokenTitle =
        "New Token Generated: " +
        tokenData.result.StartCharacter +
        tokenData.result.Token;
      set_alert(
        <ReactBSAlert
          success
          showCancel
          showCloseButton
          confirmBtnText="Print"
          cancelBtnText="SMS"
          confirmBtnBsStyle="info"
          cancelBtnBsStyle="danger"
          title={newTokenTitle}
          onConfirm={() => printTokenNum(tokenData.result)}
          onCancel={() => hideAlert()}
          customButtons={
            <React.Fragment>
              <button onClick={() => printTokenNum(tokenData.result)}>
                Print
              </button>
              <button onClick={() => promptSendTwilioText(tokenData.result)}>
                SMS
              </button>
              <button onClick={() => hideAlert()}>Close</button>
            </React.Fragment>
          }
        ></ReactBSAlert>
      );
    } else {
      newTokenTitle = tokenData.message;
      set_alert(
        <ReactBSAlert
          success
          showCloseButton
          title={newTokenTitle}
          onConfirm={() => hideAlert()}
          onCancel={() => hideAlert()}
          confirmBtnBsStyle="info"
        ></ReactBSAlert>
      );
    }
  };

  const showNewTokenSMSSentFailedAlert = (status, message) => {
    if (status == "failed") {
      let newTokenTitle = message;
      set_alert(
        <ReactBSAlert
          success
          showCloseButton
          title={newTokenTitle}
          onConfirm={() => hideAlert()}
          onCancel={() => hideAlert()}
          confirmBtnBsStyle="info"
        ></ReactBSAlert>
      );
    }
  };

  const showNewTokenSMSSentSuccessfulORFailedAlert = (tokenData) => {
    //let phone_num_code = "";
    var newTokenTitle = "";
    if (tokenData.status == "success") {
      newTokenTitle =
        "SMS for token " +
        tokenData.result.Token +
        " was successfully sent to " +
        mobileNumRef.current /*tokenData.result.ToPhoneNumber*/;
      set_alert(
        <ReactBSAlert
          success
          showCancel
          showCloseButton
          confirmBtnBsStyle="info"
          cancelBtnBsStyle="danger"
          title={newTokenTitle}
          onConfirm={() => hideAlert()}
          onCancel={() => hideAlert()}
        ></ReactBSAlert>
      );
    } else {
      newTokenTitle = tokenData.message;
      set_alert(
        <ReactBSAlert
          success
          showCloseButton
          title={newTokenTitle}
          onConfirm={() => hideAlert()}
          onCancel={() => hideAlert()}
          confirmBtnBsStyle="info"
        ></ReactBSAlert>
      );
    }
    set_phone_num("");
  };

  const promptSendTwilioText = (data) => {
    hideAlert();
    console.log("promptSendTwilioText", data);
    var newTokenTitle = "";
    newTokenTitle = "New Token Generated: " + data.StartCharacter + data.Token;
    set_alert(
      <ReactBSAlert
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        title={newTokenTitle}
        onConfirm={(response) => sendTwilioText(data)}
        onCancel={() => hideAlert()}
      >
        <div style={{ textAlign: "left" }}>
          Enter SMS number (+[Country_Code][Area_Code][Phone_Number]):
        </div>
        <div style={{ height: "10px" }}></div>
        <div style={{ textAlign: "left" }}>
          <PhoneInput
            country={"us"}
            value={phone_num}
            onChange={(phone_num) => setPhoneNumber(phone_num)}
          />
        </div>
        <div style={{ height: "210px" }}></div>
      </ReactBSAlert>
    );
  };

  const setPhoneNumber = (num) => {
    let phoneNumFormatted = "+" + num.toString();
    console.log(
      "phoneNumNonFormatted",
      num,
      "phoneNumFormatted",
      phoneNumFormatted
    );
    set_phone_num(phoneNumFormatted);
    mobileNumRef.current = phoneNumFormatted;
  };

  ///Validate E164 format
  //validE164(num) { /* return /^\+?[1-9]\d{1,14}$/.test(num) */ return /^\+(?:[0-9] ?){6,14}[0-9]$/.test(num); }
  const validE164 = (value) => {
    var phoneRex = /^\+(?:[0-9] ?){6,14}[0-9]$/; // /^\+?[1-9]\d{1,14}$/
    if (phoneRex.test(value)) {
      return true;
    }
    return false;
  };

  const sendTwilioText = (data) => {
    hideAlert();

    // console.log("LocationName", data.LocationName, "LocationAddress", data.LocationAddress, "ServiceName", data.ServiceName, "StartCharacter", data.StartCharacter, "Token", data.Token, "currTokenRef.current", currTokenRef.current, "CurrentDatetime", data.CurrentDatetime, "CurrentDatetimeDate", data.CurrentDatetime.date, "CurrentDatetimeTimeZone", data.CurrentDatetime.timezone, "TokensAhead", data.TokensAhead, "ToPhoneNumber", toPhoneNumber, "mobileNumRef.current", mobileNumRef.current /*toPhoneNumber*/);
    console.log({ data: data });
    let toPhoneNumber = mobileNumRef.current; //phone_num;
    //let phoneNumCode = "";
    let locationName = data.LocationName,
      locationAddress = data.LocationAddress,
      subLocationId = data.SubLocationId,
      serviceName = data.ServiceName;
    let startCharacter = data.StartCharacter,
      token = data.Token,
      currentDatetime = data.CurrentDatetime;
    let currentDatetimeDate = data.CurrentDatetime.date,
      currentDatetimeTimeZone = data.CurrentDatetime.timezone;
    let tokensAhead = data.TokensAhead;

    let fullBaseURL = functions_base_url + "sendTwilioText";
    console.log("functions_base_url fullBaseURL", fullBaseURL); //TESTING_ONLY firdous

    if (!validE164(toPhoneNumber)) {
      //throw new Error("number must be E164 format!");
      let status = "failed";
      let message =
        "SMS for token " +
        startCharacter +
        token +
        " was not sent to " +
        toPhoneNumber +
        " because the number was not of correct E164 format! Eg: +[Country_Code][Area_Code][Phone_Number]";
      showNewTokenSMSSentFailedAlert(status, message);
    } else {
      let url = new URL(fullBaseURL),
        params = {
          subLocationId: subLocationId,
          locationName: locationName,
          locationAddress: locationAddress,
          serviceName: serviceName,
          startCharacter: startCharacter,
          token: token,
          currentDatetime: currentDatetime,
          currentDatetimeDate: currentDatetimeDate,
          currentDatetimeTimeZone: currentDatetimeTimeZone,
          tokensAhead: tokensAhead,
          toPhoneNumber: toPhoneNumber,
        };
      Object.keys(params).forEach((key) =>
        url.searchParams.append(key, params[key])
      );
      fetch(url)
        .then((response) => response.json())
        .then(
          (tokenData) => showNewTokenSMSSentSuccessfulORFailedAlert(tokenData)
          //,console.log("tokenData", tokenData)
        )
        .catch((error) => console.log("fetch error", error));
    }
  };

  const printTokenNum = (data) => {
    hideAlert();

    // console.log("LocationName", data.LocationName);
    // console.log("LocationAddress", data.LocationAddress);
    // console.log("ServiceName", data.ServiceName);
    // console.log("StartCharacter", data.StartCharacter);
    // console.log("Token", data.Token);
    // console.log("CurrentDatetime", data.CurrentDatetime);
    // console.log("TokensAhead", data.TokensAhead);

    set_LocationName(data.LocationName);
    set_LocationAddress(data.LocationAddress);
    set_ServiceName(data.ServiceName);
    set_StartCharacter(data.StartCharacter);
    set_Token(data.Token);
    set_TokenWithStartChar(data.TokenWithStartChar);
    set_CurrentDatetime(data.CurrentDatetime);
    set_TokensAhead(data.TokensAhead);
    triggerPrint.current = true;

    console.log("LocationName", data.LocationName);
    console.log("LocationAddress", data.LocationAddress);
    console.log("ServiceName", data.ServiceName);
    console.log("StartCharacter", data.StartCharacter);
    console.log("Token", data.Token);
    console.log("CurrentDatetime", data.CurrentDatetime);
    console.log("TokensAhead", data.TokensAhead);
    console.log("triggerPrint.current", triggerPrint.current);
    // handlePrint && handlePrint(); //TESTING_ONLY 123
  };

  const hideAlert = () => {
    set_alert(null);
    set_loading(false);
  };

  // const tokenData = getTokenDetails(); //TESTING_ONLY

  //const options = printing_services_list_X.map((item, i) => <option value={item.value}>{item.label}</option>);
  //[{label: "AFG", value: "Afghanistan"},
  //{label: "ALA", value: "Åland Islands"},
  //{label: "ALB", value: "Albania"}];

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  // return (
  //   <div>
  //     <ComponentToPrint ref={componentRef} />
  //     <button onClick={handlePrint}>Print this out!</button>
  //   </div>
  // );
  const dispatch = (action) => {
    // console.log("kaReducer", kaReducer(_this.state.tableprops, action));
    set_token_data({
      tokenData: kaReducer(tokenData, action),
    });
  };

  return (
    <>
      <div
        style={{
          display: "none",
          position: "absolute",
          left: 0,
          top: 0,
        }}
      >
        <div>
          <ComponentToPrint
            ref={componentRef}
            LocationName={LocationName}
            LocationAddress={LocationAddress}
            ServiceName={ServiceName}
            StartCharacter={StartCharacter}
            Token={Token}
            TokenWithStartChar={
              (StartCharacter && Token) != undefined
                ? StartCharacter.toString() + Token.toString()
                : Token
            }
            CurrentDatetime={CurrentDatetime}
            TokensAhead={TokensAhead}
          />
          {/* <button onClick={handlePrint}>Print this out!</button> */}
        </div>
      </div>
      <LoadingOverlay
        active={loading}
        spinner
        text="Loading"
        className="content"
      >
        <NotificationAlert ref={notifyAlert} />
        {alert}

        <Modal
          size="lg"
          backdrop={"static"}
          //dialogClassName="modal-90w"
          aria-labelledby="example-custom-modal-styling-title"
          isOpen={modal_classic}
          toggle={toggleModalClassic}
        >
          <>
            <ModalHeader
              className="justify-content-center"
              toggle={toggleModalClassic}
            >
              Recall Past Token Number
            </ModalHeader>
            <div className="modal-body">
              <>
                <div className="content">
                  <Form className="form-horizontal">
                    <div>
                      <CardTitle tag="h4">
                        Tokens generated by Web App client today:
                      </CardTitle>
                    </div>

                    <div>
                      {typeof tokenData !== "undefined" &&
                      tokenData !== null &&
                      tokenData.length > 0 ? (
                        <>
                          <Row
                            className="justify-content-center align-items-center"
                            style={{ rowGap: "15px" }}
                          >
                            <div md="4">Search Token Number</div>
                            <Col md="4">
                              <FormGroup className="mb-0">
                                <Input
                                  defaultValue={""}
                                  type="text"
                                  onChange={(e) => {
                                    set_token_search_term(e.target.value);
                                  }}
                                />
                              </FormGroup>
                            </Col>

                            <Button
                              size="xs"
                              color="primary"
                              className="my-0"
                              onClick={(e) => {
                                e.preventDefault();
                                handleTokenSearch();
                              }}
                            >
                              Search
                            </Button>

                            <Button
                              size="xs"
                              color="danger"
                              onClick={(e) => {
                                e.preventDefault();
                                handleTokenSearchClear();
                              }}
                            >
                              Clear
                            </Button>
                          </Row>

                          <br></br>

                          <div>
                            <KaTable
                              dispatch={dispatch}
                              data={tokenData}
                              columns={[
                                {
                                  title: "#",
                                  key: "num",
                                  sortable: false,
                                  width: 40,
                                },
                                {
                                  title: "Service Name",
                                  key: "serv_name",
                                },
                                {
                                  title: "Token Number",
                                  key: "token_num",
                                },
                                {
                                  title: "New Token Number",
                                  key: "new_tok_ref_id",
                                },
                                {
                                  title: "Input Source",
                                  key: "input_source",
                                },
                                {
                                  title: "Mobile App User",
                                  key: "mau_details",
                                },
                                {
                                  title: "Token Status",
                                  key: "token_status",
                                },
                                {
                                  title: "Action",
                                  key: "action",
                                  sortable: false,
                                },
                              ]}
                              defaultPageSize={5}
                              paging={{
                                enabled: true,
                                pageIndex: 0,
                                pageSize: 10,
                                pageSizes:
                                  tokenData.length > 10 ? [10, 50, 100] : [],
                                position: PagingPosition.Bottom,
                              }}
                              filteringMode={FilteringMode.HeaderFilter}
                              columnResizing={true}
                              // showPaginationTop={false}
                              // showPaginationBottom={true}
                              // showPageSizeOptions={false}
                              /*
                                                                                                          You can choose between primary-pagination, info-pagination, success-pagination, warning-pagination, danger-pagination or none - which will make the pagination buttons gray
                                                                                                          */
                              className="-striped -highlight primary-pagination"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                            }}
                          >
                            <lottie-player
                              src="/empty-search-result-lottie-data.json"
                              background="transparent"
                              speed="1"
                              style={{ width: "360px", height: "360px" }}
                              loop
                              autoplay
                            ></lottie-player>
                            No tokens generated by Web App client exist for
                            today!
                          </div>
                        </>
                      )}
                    </div>
                  </Form>
                </div>
              </>
            </div>
          </>
        </Modal>

        {locked_and_verified ? (
          <>
            <Row id="counter">
              <Col md="9" id="counter123">
                <Card>
                  <CardHeader>
                    <CardTitle tag="h4">Counter Run</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <Row>
                      <Col md="4">
                        <Card style={{ height: "6rem" }}>
                          <CardBody>
                            <Row className="justify-content-md-center">
                              <Col md="12">
                                {" "}
                                Serving time
                                <h3>
                                  {serving_services_id_list.length > 0 &&
                                  serving_services_id_list.length != undefined
                                    ? curr_serv_time_HrMinSec
                                    : ""}
                                </h3>
                                {/* <XCounter/> */}
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                      </Col>
                      <Col md="4">
                        <Card style={{ height: "6rem" }}>
                          <CardBody>
                            <Row className="justify-content-md-center">
                              <Col md="6">
                                Token
                                <h3>
                                  {curr_token != undefined
                                    ? curr_token.number
                                    : ""}
                                </h3>
                              </Col>
                              <Col md="6" className="">
                                Taken At
                                <h6>
                                  {curr_token.taken_at != undefined
                                    ? curr_token.taken_at.split("UTC")[0]
                                    : ""}
                                </h6>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                        {/* <h1>{counter_state}</h1> */}
                      </Col>
                      <Col md="4">
                        <Card
                          style={{
                            height: "6rem",
                            overflow: "scroll",
                            padding: "0",
                          }}
                        >
                          <CardBody>
                            <Row className="justify-content-md-center">
                              <Col md="6" className="">
                                Token Status
                                <h4 className="my-0">
                                  {curr_token.status != undefined
                                    ? curr_token.status
                                    : ""}
                                </h4>
                              </Col>
                            </Row>
                            {
                              //<Row className="">
                              //  <Col md="">
                              //  <Col md="6" className="">
                              //      <Button onClick={To}>View Token Details</Button>
                              //      <Button onClick={() => showTokenDetail(curr_token.id)}> Token Details </Button>
                              //  </Col>
                              //</Row>
                            }
                            <Row>
                              <Col className="">
                                {/* <ol>
                                    {curr_token.attachments != undefined
                                        ? curr_token.attachments.map((e, k) => {
                                            return (
                                            <li
                                                key={k}
                                                style={{
                                                listStyle: "decimal",
                                                fontSize: "0.9rem"
                                                }}
                                            >
                                                <a
                                                target="_blank"
                                                href={e.File_Attachment_URL}
                                                >
                                                {e.File_Attachment_File_Name}
                                                </a>
                                            </li>
                                            )
                                        })
                                        : ""}
                                    </ol> */}
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Service Name</th>
                          <th>Last Called Token</th>
                          {/* //_Total&Served_//<th>Total</th> */}
                          <th>Pending</th>
                          {/* //_Total&Served_//<th>Served</th> */}
                          {call_specific_service == true ? (
                            <th>Filter Calls</th>
                          ) : null}
                          {generate_token_for_specific_service == true ? (
                            <th>Actions</th>
                          ) : null}
                        </tr>
                      </thead>
                      <tbody>{getServices()}</tbody>
                    </Table>
                  </CardBody>
                </Card>
              </Col>
              <Col md="3">
                <Card>
                  {/* <CardHeader>
                                <CardTitle tag="h4">Counter Operate</CardTitle>
                            </CardHeader> */}
                  <CardBody>
                    <div>
                      <Row className="justify-content-md-center">
                        <Button
                          size="lg"
                          className="col-10"
                          color="primary"
                          onClick={() => handleCallNextToken()}
                        >
                          Next
                        </Button>
                      </Row>
                      <Row className="justify-content-md-center">
                        <Button
                          size="lg"
                          className="col-10"
                          color="success"
                          onClick={() => showTokenDetail(curr_token.id)}
                        >
                          View Details
                        </Button>
                      </Row>
                      <Row className="justify-content-md-center">
                        <Button
                          size="lg"
                          className="col-10"
                          color="warning"
                          onClick={() => handleNoShowToken()}
                        >
                          No Show
                        </Button>
                      </Row>
                      <Row className="justify-content-md-center">
                        <Button
                          size="lg"
                          className="col-10"
                          color="danger"
                          onClick={() => handleRepeatToken()}
                        >
                          Repeat
                        </Button>
                      </Row>
                      {recall_already_called_token == true ? (
                        <Row className="justify-content-md-center">
                          <Button
                            size="lg"
                            className="col-10"
                            color="danger"
                            onClick={() => handleRecallToken()}
                          >
                            Recall
                          </Button>
                        </Row>
                      ) : null}
                      <Row className="justify-content-md-center">
                        <Button
                          size="lg"
                          className="col-10"
                          color="youtube"
                          onClick={() => handleCloseCounter()}
                        >
                          Close Counter
                        </Button>
                      </Row>
                      <Row className="justify-content-md-left">
                        <Col md="12" className="">
                          Counter State
                        </Col>
                      </Row>
                      <CreatableSelect
                        isClearable
                        defaultValue={default_counter_state}
                        isDisabled={false}
                        //isValidNewOption={isValidBillingCounterState}
                        value={counter_state}
                        onChange={handleChangeCounterState}
                        options={combined_counter_states}
                      />
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col md="12">
                <Card>
                  <CardHeader>
                    <CardTitle tag="h4">Counter Info</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <Row>
                      <Col md="6">
                        Counter: <h6>{counter_name}</h6>
                      </Col>
                      <Col md="6">
                        User: <h6>{user_name}</h6>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="6">
                        Location address:{" "}
                        <h6>{main_location_name + "\\" + sub_location_name}</h6>
                      </Col>
                      <Col md="6">
                        {locked ? "Locked to computer" : "Not locked"}
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </>
        ) : (
          <h1>This counter is locked to a different device</h1>
        )}
      </LoadingOverlay>
    </>
  );
}

export default CounterRun;
