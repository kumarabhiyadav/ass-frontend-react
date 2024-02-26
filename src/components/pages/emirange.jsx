import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  Modal,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { domain, endPoints } from "../../api";

export default function EmiRange() {
  let initialFormValue = {
    amountMin: "",
    amountMax: "",
    rateofintrest: "",
    months: "",
  };
  let dataToEdit = undefined;
  const [tableData, setTabledata] = useState([]);
  const [formData, setFormData] = useState(initialFormValue);
  const [showModal, setshowModal] = useState(false);
  const [showModalDelete, setshowModalDelete] = useState(false);

  const [validationError, setValidationError] = useState("");

  const handleSubmit = async () => {
    let isValid = true;
    setValidationError("");

    if (!isValidNumber(formData.amountMin)) {
      isValid = false;
      setValidationError("AmountMin must be a number.");
    }

    if (!isValidNumber(formData.amountMax)) {
      isValid = false;
      setValidationError("AmountMax must be a number.");
    }

    if (!isValidNumber(formData.rateofintrest)) {
      isValid = false;
      setValidationError("Rate of Interest must be a number.");
    }

    if (!isValidNumber(formData.months)) {
      isValid = false;
      setValidationError("Months must be a number.");
    }

    if (isValid) {
      // Handle form submission here, e.g., send data to an API
      console.log("Form submitted:", formData);

      formData.amountMax = parseInt(formData.amountMax);
      formData.amountMin = parseInt(formData.amountMin);
      formData.rateofintrest = parseInt(formData.rateofintrest);
      formData.months = parseInt(formData.months);

      if (formData.id) {
        const result = await axios.put(
          domain + endPoints.editEmiRange,
          formData
        );
        console.log(result);

        if (result.data.success) {
          let index = tableData.findIndex(
            (emi) => emi.id == result.data.result._id
          );

          tableData[index] = {
            id: result.data.result._id,
            amountMin: result.data.result.amountMin,
            amountMax: result.data.result.amountMax,
            rateofintrest: result.data.result.rateofintrest,
            months: result.data.result.months,
            action: (
              <>
                <Button
                  className="me-2"
                  color="dark"
                  onClick={() => {
                    editEmiRange(result.data.result);
                  }}
                >
                  Edit
                </Button>

                <Button
                  color="danger"
                  onClick={() => {
                    deleteRange(result.data.result);
                  }}
                >
                  Delete
                </Button>
              </>
            ),
          };

          setTabledata(tableData);
        }
        setshowModal(false);
        return;
      }

      const result = await axios.post(
        domain + endPoints.createEmiRange,
        formData
      );

      if (result.data.success) {
        tableData.unshift({
          id: result.data.result._id,
          amountMin: result.data.result.amountMin,
          amountMax: result.data.result.amountMax,
          rateofintrest: result.data.result.rateofintrest,
          months: result.data.result.months,
          action: (
            <>
              <Button
                className="me-2"
                color="dark"
                onClick={() => {
                  editEmiRange(result.data.result);
                }}
              >
                Edit
              </Button>

              <Button
                color="danger"
                onClick={() => {
                  //   handleSubmit();
                  deleteRange(result.data.result);
                }}
              >
                Delete
              </Button>
            </>
          ),
        });
      }
      setshowModal(false);
    }
  };

  const handleChange = (event) => {
    console.log(event.target.value.replaceAll("e", ""));
    if (event.target.value.indexOf("e") != -1) return;
    setFormData({
      ...formData,
      [event.target.id]: event.target.value,
    });
  };

  const isValidNumber = (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
  };

  useEffect(() => {
    (async function () {
      let data = (await axios.get(domain + endPoints.fetchEmiRange)).data;
      if (data.success) {
        let result = data.result.map((e) => {
          return {
            id: e._id,
            amountMin: e.amountMin,
            amountMax: e.amountMax,
            rateofintrest: e.rateofintrest,
            months: e.months,

            action: (
              <>
                <Button
                  className="me-2"
                  color="dark"
                  onClick={() => {
                    editEmiRange(e);
                  }}
                >
                  Edit
                </Button>

                <Button
                  color="danger"
                  onClick={() => {
                    //   handleSubmit();

                    deleteRange(e);
                  }}
                >
                  Delete
                </Button>
              </>
            ),
          };
        });
        setTabledata([...result]);
        console.log(tableData);
      }
    })();
  }, []);

  function editEmiRange(data) {
    console.log(data);
    if (data) {
      initialFormValue = {
        id: data._id,
        amountMin: data.amountMin,
        amountMax: data.amountMax,
        rateofintrest: data.rateofintrest,
        months: data.months,
      };

      setFormData({ ...initialFormValue });
    }
    setshowModal(true);
  }

  function deleteRange(data) {
    setFormData({
      ...{
        id: data._id,
        amountMin: data.amountMin,
        amountMax: data.amountMax,
        rateofintrest: data.rateofintrest,
        months: data.months,
      },
    });
    setshowModalDelete(true);
  }

  return (
    <>
      <Modal isOpen={showModalDelete}>
        <ModalHeader
          toggle={() => {
            setshowModalDelete(false);
          }}
        >
          Delete EMI range
        </ModalHeader>
        <ModalBody>Are you sure want to delete this emi range</ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            onClick={async () => {
              let result = await axios.delete(
                domain + endPoints.deleteEmiRange + "/" + formData.id
              );
              console.log(result);
              if (result.data.success) {
                let index = tableData.findIndex(
                  (e) => e.id == result.data.result._id
                );
                tableData.splice(index, 1);
                setTabledata(tableData);
              }
              setshowModalDelete(false);
            }}
          >
            Save
          </Button>

          <Button
            color="secondary"
            onClick={() => {
              setshowModalDelete(false);
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={showModal} centered>
        <ModalHeader
          toggle={() => {
            setshowModal(false);
          }}
        >
          Please Fill Details for create new range
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit}>
            {validationError && (
              <p className="text-danger">{validationError}</p>
            )}
            <FormGroup>
              <Label for="amountMin">Range Start(₹)</Label>
              <Input
                type="number"
                id="amountMin"
                value={formData.amountMin}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="amountMax">Range End (₹)</Label>
              <Input
                type="number"
                id="amountMax"
                value={formData.amountMax}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="rateofintrest">Rate of Interest (%):</Label>
              <Input
                type="number"
                id="rateofintrest"
                value={formData.rateofintrest}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label for="months">Months :</Label>
              <Input
                type="number"
                id="months"
                value={formData.months}
                onChange={handleChange}
                required
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => {
              handleSubmit();
            }}
          >
            Save
          </Button>

          <Button
            color="secondary"
            onClick={() => {
              setshowModal(false);
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      <div>
        <div className="d-flex justify-content-end">
          <Button
            color="primary"
            onClick={() => {
              setshowModal(true);
            }}
          >
            Add New Range
          </Button>
        </div>
      </div>

      <div className="my-2"></div>

      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>Min Amount</th>
            <th>Max Amount</th>
            <th>Rate Of Intrest</th>
            <th>Months</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((item) => (
            <tr key={item.id}>
              {/* <td>{item.id}</td> */}
              <td>{item.amountMin}</td>
              <td>{item.amountMax}</td>
              <td>{item.rateofintrest}</td>
              <td>{item.months}</td>
              <td>{item.action}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
