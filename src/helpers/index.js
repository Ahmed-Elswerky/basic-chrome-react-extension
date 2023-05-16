import { Alert, Button } from "reactstrap";

export const showAlert = ({
  message,
  setAlert,
  timeout = 3000,
  navigate = false,
  returnTo = "/",
  variant = "warning",
  onClose = setAlert,
}) => {
  console.log('typeof setAlert',typeof setAlert);
  if (typeof setAlert != "function") setAlert = () => {};
  setAlert(
    <Alert
      style={{position:'fixed',top:'0',left:'50%',translate:'-50% 50%',zIndex:'99'}}
      color={variant}
      // open={true}
      // autoHideDuration={timeout}
      // message={message}
      // action={<Button onClick={() => setAlert()}>X</Button>}
      toggle={() => onClose()}
    >{message}</Alert>
  );
  setTimeout(() => {
    setAlert();
    if (navigate != false) navigate(returnTo);
  }, timeout);
};
