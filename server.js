const express = require("express");
const cors = require('cors');
const connectDB = require("./config/db");
const Profile = require("./models/Profile");
const User = require("./models/User");
 

const app = express();
app.use(cors());

//Connect Database
connectDB();

//Init Middleware
app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("API running"));

//Define routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/spotify", require("./routes/api/spotify"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
