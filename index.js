const express = require("express");
const connectDB = require("./utils/connect");
const cors = require("cors");
const app = express();
app.use(cors());
require("./utils/swaggerUtils")(app);
app.use(express.json());
const Auth = require("./Routes/Auth");
const abal = require("./Routes/Abal");
const gbigubae = require("./Routes/Gbigubae");
const Role = require("./Routes/Role");
const Teacher = require("./Routes/Teachers");
const Staff = require("./Routes/Staff");
const Service = require("./Routes/Service");

app.use("/api/auth", Auth);
app.use("/api/abal", abal);
app.use("/api/gbigubae", gbigubae);
app.use("/api/role", Role);
app.use("/api/teacher", Teacher);
app.use("/api/staff", Staff);
app.use("/api/service", Service);

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    console.log("MongoDB connected successfully!");

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit the process with failure
  });
