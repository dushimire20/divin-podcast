const express = require("express");
require("dotenv").config();
require("./mongo_conn/conn");
const app = express();
const userApi = require("./routes/user");
const podcastApi = require("./routes/podcast");
const categoryApi = require("./routes/categories");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const PORT = process.env.PORT || 6000;

app.use(
  cors({
    origin: "http://localhost:5174", // Allow frontend (React) to access the backend
    credentials: true, // Allow cookies to be sent with requests
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

app.use("/api/v1", userApi);
app.use("/api/v1", podcastApi);
app.use("/api/v1", categoryApi);

app.get("/", (req, res) => {
  res.send("<h1>Welcome to the API!</h1><p>This is a simple API server. Use the /api/v1 endpoints to interact with it.</p>");
});

app.use((req, res) => {
  res.status(404).send("<h1>404 Not Found</h1><p>The route you're trying to access doesn't exist. Please check the URL.</p>");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log("API server is up and ready to handle requests!");
});