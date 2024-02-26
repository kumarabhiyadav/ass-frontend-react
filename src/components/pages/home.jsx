import React, { useEffect, useState } from "react";
import { Button } from "reactstrap";
import "../styles/home.css";
import { domain, endPoints } from "../../api";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  let [products, setProducts] = useState([]);

  const navigator = useNavigate();

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
      <div class="wrapper">
        {products.map((e) => (
          <div className="card">
            <img src="https://placehold.co/100" alt="" srcset="" />
            <div className="h6">{e.name}</div>
            <div className="h7">₹{e.price}</div>
            <div className="my-1"></div>
            <Button
              color="primary"
              onClick={() => {
                navigator("/emicalculator", { state: {product : {...e}} });
              }}
            >
              Check EMI
            </Button>
          </div>
        ))}
      </div>
    </>
  );
};
