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
  if (typeof setAlert != "function") setAlert = () => {};
  setAlert(
    <Alert
      variant={variant}
      open={true}
      autoHideDuration={timeout}
      message={message}
      action={<Button onClick={() => setAlert()}>X</Button>}
      onClose={() => onClose()}
    />
  );
  setTimeout(() => {
    setAlert();
    if (navigate != false) navigate(returnTo);
  }, timeout);
};
