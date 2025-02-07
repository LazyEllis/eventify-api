const express = require("express");
const cors = require("cors");
const authRouter = require("./routes/authRouter");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
