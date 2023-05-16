import React, { useState } from "react";
import {
  Button,
  Col,
  FormGroup,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Input,
} from "reactstrap";
import CreatableSelect from "react-select/creatable";

export default function ServiceModalBtn({
  service,
  serviceRef,
  sublocationRef,
  serviceDetailsForDisplays,
  serviceDetUpdate,
  btnDisabled,
}) {
  const [serviceModal, setServiceModal] = useState(false);
  const [serviceDetailsForDisplay, setServiceDetailsForDisplay] = useState({
    label: service?.serviceDetailsForDisplays,
    value: service?.serviceDetailsForDisplays,
  });
  const [saving, setSaving] = useState(false);

  const handleOpen = () => setServiceModal(true);
  const handleClose = () => setServiceModal(false);

  const handleUpdate = async () => {
    if (serviceDetailsForDisplay?.value != service?.serviceDetailsForDisplays) {
      setSaving(true);
      await serviceRef
        .update({
          Service_Details_For_Display: serviceDetailsForDisplay?.value || "",
        })
        .catch((e) => {
          console.log("service modal details save error:", e);
          setSaving(false);
        });
      serviceDetUpdate();

      setSaving(false);

      handleClose();
    } else handleClose();
  };
  // if (!serviceModal)
  //   return (
  //     <Button size="sm" className="ml-1" color="info" onClick={handleOpen}>
  //       {/* <i className="nc-icon nc-minimal-down" /> */}
  //       -
  //     </Button>
  //   );
  return (
    <>
      <Button
        size="sm"
        className="ml-1 text-white"
        style={{fontSize:'1.2rem'}}
        color="info"
        onClick={handleOpen}
        disabled={!btnDisabled}
      >
        {/* <i className="nc-icon nc-minimal-down" /> */}-
      </Button>
      <Modal size="lg" isOpen={serviceModal} toggle={handleClose}>
        <ModalHeader className="justify-content-center" toggle={handleClose}>
          Modify Service Details for Display
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <div>
                <FormGroup className="my row">
                  <Label xs="4">Service Name</Label>
                  <Col xs="8">
                    <Input
                      className="css-10nd86i react-select info select-location"
                      value={service.name}
                      type="text"
                      name="name"
                      disabled
                    />
                  </Col>
                </FormGroup>
              </div>
              <div>
                <FormGroup className="my row">
                  <Label xs="4">Service Details For Display</Label>
                  <Col xs="8">
                    <CreatableSelect
                      isClearable
                      className="react-select primary"
                      classNamePrefix="react-select"
                      value={serviceDetailsForDisplay}
                      onChange={setServiceDetailsForDisplay}
                      options={serviceDetailsForDisplays || []}
                      onCreateOption={(b) => {
                        sublocationRef.update({
                          Service_Details_For_Display: [
                            ...serviceDetailsForDisplays?.map(
                              (e) => e?.value || e
                            ),
                            b?.value || b,
                          ],
                        });
                        setServiceDetailsForDisplay({ label: b, value: b });
                      }}
                    />
                  </Col>
                </FormGroup>
              </div>
            </Col>
          </Row>
        </ModalBody>

        <ModalFooter className="px-2">
          <Button onClick={handleUpdate} color="success">
            {`${saving ? "Saving..." : "Save"}`}
          </Button>
          <Button onClick={handleClose} color="secondary">
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
