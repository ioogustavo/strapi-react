const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");

const app = express();

const stripe = new Stripe(
  "sk_test_51HmJVEEkboGuyxn3EjH9azCtVpiKuwlS0bap2Ncu3AhFUWMJ89ZAbeQukMaU8tZ0fqo2n6cdbPc2kTr6IATKMobI00qWHGkjNF"
);

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

app.post("/api/checkout", async (req, res) => {
  try {
    const { id, amount } = req.body;

    const payment = await stripe.paymentIntents.create({
      amount,
      currency: "USD",
      description: "Gaming Keyboard",
      payment_method: id,
      confirm: true,
    });

    console.log(payment);

    res.send("Succesfull payment");
  } catch (error) {
    console.log(error);
    res.json({ message: error.row.message });
  }
});

app.listen(3001, () => {
  console.log("Server on port", 3001);
});
