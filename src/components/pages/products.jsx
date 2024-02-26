import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { domain, endPoints } from "../../api";
import "../styles/home.css";

export default function Products() {
  let [products, setProducts] = useState([]);
  const [showDeleteModel, setShowDeleteModel] = useState(false);
  const initialFormValues = {
    name: "",
    price: "",
  };

  const [formValue, setFormValue] = useState(initialFormValues);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (event) => {
    setFormValue({
      ...formValue,
      [event.target.id]: event.target.value,
    });
  };

  async function submitForm() {
    if (formValue.name.trim() == "") {
      return;
    }
    if (!isValidNumber(formValue.price)) {
      return;
    } else {
      formValue.price = parseInt(formValue.price);

      if (formValue.id) {
        console.warn(formValue);
        const result = await axios.put(
          domain + endPoints.editProduct,
          formValue
        );

        if (result.data.success) {
          let index = products.findIndex((e) => e._id == formValue.id);
          products[index] = result.data.result;
          setProducts([...products]);
          setShowModal(false);
        }

        return;
      }

      const result = await axios.post(
        domain + endPoints.createProduct,
        formValue
      );

      if (result.data.success) {
        products.unshift(result.data.result);
        setProducts([...products]);
        setShowModal(false);
      }
    }
  }

  const isValidNumber = (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
  };

  useEffect(() => {
    (async function () {
      const result = await axios.get(domain + endPoints.fetchProduct);

      if (result.data.success) {
        products = result.data.result;
        setProducts(products);
      }
    })();
  }, []);

  return (
    <>
      <Modal isOpen={showDeleteModel}>
        <ModalHeader
          toggle={() => {
            setShowDeleteModel(false);
          }}
        >
          Delete EMI range
        </ModalHeader>
        <ModalBody>
          Are you sure want to delete this product {formValue.name}
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            onClick={async () => {
              const result = await axios.delete(
                domain + endPoints.deleteProduct + "/" + formValue.id
              );
              if (result.data.success) {
                let index = products.findIndex((e) => e._id == formValue.id);

                products.splice(index, 1);

                setProducts([...products]);

                setShowDeleteModel(false);
                return;
              }

              setShowDeleteModel(false);
            }}
          >
            Delete
          </Button>

          <Button
            color="secondary"
            onClick={() => {
              setShowDeleteModel(false);
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      <Button color="primary" onClick={() => setShowModal(true)}>
        Add Product
      </Button>
      <Modal isOpen={showModal}>
        <ModalHeader
          toggle={() => {
            setShowModal(false);
          }}
        >
          Add New Product
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="name">Name</Label>
            <Input
              type="text"
              id="name"
              value={formValue.name}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="price">Price</Label>
            <Input
              type="number"
              id="price"
              value={formValue.price}
              onChange={handleChange}
              required
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => {
              submitForm();
            }}
          >
            Save
          </Button>

          <Button
            color="secondary"
            onClick={() => {
              setShowModal(false);
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      <div class="wrapper">
        {products.map((e) => (
          <div className="card">
            <img src="https://placehold.co/50" alt="" srcset="" />
            <div className="h6">{e.name}</div>
            <div className="h7">₹{e.price}</div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <Button
                  color="danger"
                  onClick={() => {
                    formValue.name = e.name;
                    formValue.id = e._id;

                    setShowDeleteModel(true);
                  }}
                >
                  Delete
                </Button>
              </div>

              <div>
                <Button
                  color="primary"
                  onClick={() => {
                    formValue.name = e.name;
                    formValue.price = e.price;
                    formValue.id = e._id;

                    setShowModal(true);
                  }}
                >
                  Edit
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
