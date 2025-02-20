const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const eventRouter = require("./routes/eventRouter");
const ticketRouter = require("./routes/ticketRouter");
const ticketTypeRouter = require("./routes/ticketTypeRouter");
const messageRouter = require("./routes/messageRouter");
const analyticsRouter = require("./routes/analyticsRouter");
const attendeeRouter = require("./routes/attendeeRouter");
const virtualEventRouter = require("./routes/virtualEventRouter");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/events", eventRouter);
app.use("/tickets", ticketRouter);
app.use("/", ticketTypeRouter);
app.use("/", messageRouter);
app.use("/analytics", analyticsRouter);
app.use("/", attendeeRouter);
app.use("/", virtualEventRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).send(err.message);
  next();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
