import React, { useEffect, useState } from "react";
import {
  Form,
  Label,
  Input,
  Button,
  FormGroup,
  Modal,
  ModalHeader,
  ModalFooter,
  ModalBody,
} from "reactstrap";
import { Chart } from "react-google-charts";
import "../styles/emicalculator.css";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { domain, endPoints } from "../../api";

function EmiCalculator() {
  const location = useLocation();

  const product = location.state?.product;

  const [showLoanGraph, setLoanGraph] = useState(false);
  const [loanAmount, setLoanAmount] = useState(product ? product.price : 0);
  const [interestRate, setInterestRate] = useState(7);
  const [loanTerm, setLoanTerm] = useState(1); // Years
  const [termType, setTermType] = useState("years");
  const [showError, setShowerror] = useState(false);
  const [result, setResult] = useState({
    emi: 0,
    totalInterest: 0,
    interestPerMonth: 0,
  });

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  function calculateEMI(principal, rate, term, termType = "years") {
    if (principal <= 0 || rate <= 0 || term <= 0) {
      setShowerror(true);

      return;
    }

    const monthlyRate = termType === "months" ? rate / 100 : rate / (12 * 100);

    const totalMonths = termType === "years" ? term * 12 : term;

    const emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);

    const roundedEmi = emi.toFixed(2);

    const totalInterest = totalMonths * emi - principal;
    const interestPerMonth = (totalInterest / totalMonths).toFixed(2);

    let obj = {
      emi: roundedEmi,
      totalInterest: totalInterest.toFixed(0),
      interestPerMonth: interestPerMonth,
    };
    setResult({ ...obj });
    setLoanGraph(true);
  }

  useEffect(() => {
    (async function () {
      if (!product) return;
      const result = await axios.get(
        domain + endPoints.fetchEmiRangeByAmount + "/" + product.price
      );

      if (result.data.success) {
        if (result.data.result) {
          let data = result.data.result;
          console.warn(data);
          setInterestRate(data.rateofintrest);
          setLoanTerm(data.months);
          setTermType("months");
          calculateEMI(loanAmount,data.rateofintrest,data.months,"months");   
        }
      }
    })();
  }, []);

  return (
    <>
      <div className="container">
        <Modal
          isOpen={showError}
          toggle={() => {
            setShowerror(!showError);
          }}
        >
          <ModalHeader
            toggle={() => {
              setShowerror(!showError);
            }}
          >
            Alert
          </ModalHeader>
          <ModalBody>No input should be less than zero (0)</ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              onClick={() => {
                setShowerror(!showError);
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
        <div className="d-flex">
          <div className="col-lg-6 shadow p-3 mb-5 bg-white rounded">
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label for="loan_amount">Loan Amount:</Label>
                <Input
                  type="number"
                  id="loan_amount"
                  name="loan_amount"
                  value={loanAmount}
                  onChange={(event) => setLoanAmount(event.target.value)}
                  min="0"
                  step="0.01"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="interest_rate">Interest Rate (%):</Label>
                <Input
                  type="number"
                  id="interest_rate"
                  name="interest_rate"
                  value={interestRate}
                  onChange={(event) => setInterestRate(event.target.value)}
                  min="0"
                  step="0.01"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="loan_term">Loan Term:</Label>
                <Input
                  type="number"
                  id="loan_term"
                  name="loan_term"
                  value={loanTerm}
                  onChange={(event) => setLoanTerm(event.target.value)}
                  min="1"
                />

                <Label for="loan_term_type">Loan Term type:</Label>

                <Input
                  type={"select"}
                  value={termType}
                  onChange={(event) => setTermType(event.target.value)}
                >
                  <option value="years">Years</option>
                  <option value="months">Months</option>
                </Input>
              </FormGroup>
              <Button
                type="submit"
                color="primary"
                onClick={() => {
                    calculateEMI(loanAmount, interestRate, loanTerm, termType)
                }}
              >
                Calculate Loan Details
              </Button>
            </Form>
          </div>
          <div className="mx-2"></div>

          {showLoanGraph && (
            <div className="col-lg-6   shadow p-3 mb-5 bg-white rounded">
              <Chart
                chartType="PieChart"
                width={"100%"}
                height={"300px"}
                data={[
                  ["Breakdown", "Value"],
                  ["Principal Amount", parseInt(loanAmount)], // Remaining loan amount after interest
                  ["Interest Paid", parseInt(result.totalInterest)], // Interest paid
                ]}
                options={{
                  // Additional customization options here, if needed
                  title:
                    "Loan Break up of \t(₹" +
                    (parseInt(loanAmount) + parseInt(result.totalInterest)) +
                    ")",
                  is3D: true,
                }}
              />
              <div className="d-flex justify-content-between">
                <div>
                  <div>Principal Amount</div>
                  <br />
                  <div>Monthly EMI</div>
                  <div>Total Intrest</div>
                  <div>Per Month Intrest </div>
                </div>
                <div>
                  <div>₹{loanAmount}</div>
                  <br />
                  <div>₹{result.emi}</div>
                  <div>₹{result.totalInterest}</div>
                  <div>₹{result.interestPerMonth}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default EmiCalculator;
