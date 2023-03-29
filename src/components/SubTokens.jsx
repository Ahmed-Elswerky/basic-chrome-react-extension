import React, { useEffect, useState } from "react";
import Firebase from "firebase/compat/app";
import "firebase/compat/firestore";
// import ReactTable from "react-table-6";
import moment from "moment-timezone";

function SubTokens(props) {
  const [subId] = useState(props.ids);
  const [hideModal] = useState(props.hide);
  const [customer_id] = useState(props.customer_id);
  const [TokenDetails] = useState(props.TokenDetails);
  const [_, set_token_details_list1] = useState([]);
  const [token_details_list, set_token_details_list] = useState([]);
  const [alert] = useState(null);

  useEffect(() => {
    let token_details_list2 = [];
    if (subId != undefined && token_details_list.length == 0)
      subId.forEach((e, k) => {
        Firebase.firestore()
          .collection("Token_Details")
          .where("Customer_ID", "==", customer_id)
          .where("Sub_Location_ID", "==", e)
          // .where(
          //   'Request_Approval_Group_Profile_Id',
          //   'in',
          //   Request_Approval_Groups_Assigned
          // )
          .where("Token_Status", "in", [
            "Pending",
            "Approved_Pending_Service",
            "Now_Serving",
          ])
          .orderBy("Service_Datetime_Unix_Timestamp", "asc")
          .get()
          .then(function (response) {
            response.docs.forEach(function (tok) {
              const option = {
                token_detail_id: tok.id,
                id: tok.id,
                value: tok.id,
                customer_id: tok.data().Customer_ID,
                created_datetime: tok.data().Created_Datetime,
                created_datetime_ts: tok.data().Created_Datetime_Unix_Timestamp,
                requested_datetime: tok.data().Requested_Datetime,
                requested_datetime_ts:
                  tok.data().Requested_Datetime_Unix_Timestamp,
                service_datetime: tok.data().Service_Datetime,
                service_datetime_formatted: moment(
                  new Date(
                    parseInt(tok.data().Service_Datetime_Unix_Timestamp) * 1000
                  )
                )
                  .tz(tok.data().TimeZone)
                  .format("YYYY-MM-DD"),
                service_datetime_ts: tok.data().Service_Datetime_Unix_Timestamp,
                internal_response: tok.data().Internal_Response,
                service_type: tok.data().Service_Type,
                start_char: tok.data().Start_Character,
                input_source: tok.data().Input_Source,
                main_loc_id: tok.data().Main_Location_ID,
                sub_loc_id: tok.data().Sub_Location_ID,
                serv_id: tok.data().Services_ID,
                main_loc_nam: tok.data().Main_Location_Name,
                sub_loc_nam: tok.data().Sub_Location_Name,
                serv_name: tok.data().Service_Name,
                serv_start_date: tok.data().Service_Start_Datetime,
                token_num: tok.data().Token_Number_String,
                token_status: tok.data().Token_Status,
                waiting_time: tok.data().Waiting_Time,
                mau_id: tok.data().Mobile_App_User_ID,
                mau_contact: tok.data().Mobile_App_User_Contact,
                mau_email: tok.data().Mobile_App_User_Email,
                mau_name: tok.data().Mobile_App_User_Name,
                time_zone: tok.data().TimeZone,
                new_tok_ref_id: tok.data().New_Token_Reference_ID,
                new_tok_ref_num: tok.data().New_Token_Reference_Num,
                cancelled_tok_ref_id: tok.data().Cancelled_Token_Reference_ID,
                cancelled_tok_ref_num: tok.data().Cancelled_Token_Reference_Num,
                new_tok_ref_prev_tok_cancelled_reason:
                  tok.data().Cancelled_Reason,
                input_fields: tok.data().Mobile_App_Input_Fields,
                file_attachments: tok.data().Mobile_App_File_Attachments,

                // label: Name,
              };
              token_details_list2.push(option);
            });
            if (k + 1 >= subId.length) {
              set_token_details_list1(token_details_list2);
              getTokenDetails(token_details_list2);
            }
          });
      });
  }, []);
  const formatTokenStatus = (str) => {
    var splitStr = str.toLowerCase().split("_");
    for (var i = 0; i < splitStr.length; i++) {
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(" ");
  };

  const getTokenDetails = (d) => {
    var data = [];
    console.log("gettokendetails-- ", d);
    d.map((prop, key) => {
      var tokStatus = "";
      tokStatus = formatTokenStatus(prop.token_status);
      var mauID = "";
      var mauContact = "";
      var mauEmail = "";
      var mauName = "";
      if (
        typeof prop.mau_id !== "undefined" &&
        prop.mau_id !== null &&
        prop.mau_id !== ""
      ) {
        mauID = prop.mau_id;
        mauContact = prop.mau_contact;
        mauEmail = prop.mau_email;
        mauName = prop.mau_name;
      }

      data.push({
        key: key + 1,
        name: prop.name,
        sub_loc_nam: prop.sub_loc_nam,
        requested_datetime: prop.requested_datetime,
        service_datetime: prop.service_datetime,
        serv_name: prop.serv_name,

        mobile_app_user:
          typeof prop.mau_id !== "undefined" &&
          prop.mau_id !== null &&
          prop.mau_id !== ""
            ? mauName + " / " + mauEmail + " / " + mauContact
            : "",
        result: "",
        message: "",
        start_char: prop.start_char,
        token_num: prop.token_num,
        new_tok_ref_num:
          prop.new_tok_ref_id !== null &&
          typeof prop.new_tok_ref_id !== "undefined" &&
          prop.new_tok_ref_id !== ""
            ? prop.new_tok_ref_num
            : "N/A",
        token_status:
          prop.token_status === "Closed" ||
          prop.token_status === "Cancelled" ||
          prop.token_status === "No_show" ||
          prop.token_status === "No_Show" ||
          prop.token_status === "Rejected" ? (
            <span className="badge badge-pill badge-danger">{tokStatus}</span>
          ) : prop.token_status === "Pending" ||
            prop.token_status === "Pending_Approval" ? (
            <span className="badge badge-pill badge-warning">{tokStatus}</span>
          ) : prop.token_status === "Now_Serving" ||
            prop.token_status === "Approved_Pending_Service" ? (
            <span className="badge badge-pill badge-info">{tokStatus}</span>
          ) : prop.token_status === "Served" ? (
            <span className="badge badge-pill badge-success">{tokStatus}</span>
          ) : (
            <span className="badge badge-pill badge-default">{tokStatus}</span>
          ),
        action: (
          <>
            <Button
              size="xs"
              className="btn btn-primary btn-sm"
              color="info"
              onClick={() => {
                hideModal();
                TokenDetails(prop.id);
              }}
            >
              <i className="nc-icon nc-alert-circle-i" />
            </Button>
          </>
        ),
      });
    });

    if (token_details_list != data) set_token_details_list(data);
  };

  return (
    <>
      {alert}
      {console.log(token_details_list)}
      {/* <ReactTable
        data={token_details_list}
        columns={[
          { Header: "#", accessor: "key", width: 40 },
          { Header: "Sub Location", accessor: "sub_loc_nam" },
          { Header: "Service Date", accessor: "service_datetime" },
          { Header: "Requested Date", accessor: "requested_datetime" },
          { Header: "Service Name", accessor: "serv_name" },
          { Header: "Token Number", accessor: "token_num" },
          { Header: "New Token Number", accessor: "new_tok_ref_num" },
          {
            Header: "Mobile App User",
            accessor: "mobile_app_user",
            width: 350,
          },
          { Header: "Token Status", accessor: "token_status", width: 200 },
          { Header: "Action", accessor: "action", sortable: false, width: 200 },
        ]}
        defaultPageSize={5}
        showPaginationTop={false}
        showPaginationBottom={true}
        showPageSizeOptions={false}
        className="-striped -highlight primary-pagination"
      /> */}
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Sub Location</th>
            <th>Service Date</th>
            <th>Requested Date</th>
            <th>Service Name</th>
            <th>Token Number</th>
            <th>New Token Number</th>
            <th>Mobile App User</th>
            <th>Token Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {token_details_list?.map((token, index) => (
            <tr key={index}>
              <td>{token?.sub_loc_nam}</td>
              <td>{token?.service_datetime}</td>
              <td>{token?.requested_datetime}</td>
              <td>{token?.serv_name}</td>
              <td>{token?.token_num}</td>
              <td>{token?.new_tok_ref_num}</td>
              <td>{token?.mobile_app_user}</td>
              <td>{token?.token_status}</td>
              <td>{token?.action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default SubTokens;
