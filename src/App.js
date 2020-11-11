import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";

import "bootswatch/dist/lux/bootstrap.min.css";
import "./App.css";
const {KEY} = process.env

const stripePromise = loadStripe(`${KEY}`);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setloading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });
    setloading(true);
    // console.log(error, paymentMethod)
    if (!error) {
      const { id } = paymentMethod;
      try {
        const { data } = await axios.post(
          "http://localhost:3001/api/checkout",
          {
            id,
            amount: 100000,
          }
        );
        console.log(data);

        elements.getElement(CardElement).clear();
      } catch (error) {
        console.log(error);
      }
      setloading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card card-body">
      <img
        src="https://www.pngitem.com/pimgs/m/466-4663989_razer-blackwidow-chroma-v2-gaming-keyboard-green-switches.png"
        alt="keyboard"
        className="img-fluid"
      ></img>
      <h3 className="text-center my-2">Price: $100</h3>
      <div className="form-group">
        <CardElement className="form-control" />
      </div>

      <button className="btn btn-success" disabled={!stripe}>
        {loading ? (
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          "Buy"
        )}
      </button>
    </form>
  );
};

function App() {
  return (
    <Elements stripe={stripePromise}>
      <div className="container p-4">
        <div className="row">
          <div className="col-md-4 offset-md-4">
            <CheckoutForm />
          </div>
        </div>
      </div>
    </Elements>
  );
}

export default App;
