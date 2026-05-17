const express = require("express");
const cors = require("cors");
require('dotenv').config();

const studentRoutes = require("./routes/studentRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());

app.use("/students", studentRoutes);

app.listen(PORT,()=>{
 console.log(`Server lives on port ${PORT}`);
});
