// Importing necessary modules and packages
const express = require("express");
const app = express();
const userRoutes = require("./routes/User.js");
const profileRoutes = require("./routes/Profile.js");
const courseRoutes = require("./routes/Course.js");
const paymentRoutes = require("./routes/Payments.js");
const contactUsRoute = require("./routes/Contact");
const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary.js");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

const PORT = process.env.PORT || 4000;

dotenv.config();

database.connect();
 
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        // origin: "http://localhost:5173",
        origin: ["http://localhost:5173", "https://study-notion-ed-tech-ipsejb2ma.vercel.app"],
        credentials: true,
    })
);
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
    })
);

cloudinaryConnect();

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactUsRoute);

app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Your server is up and running ...",
    });
});

app.listen(PORT, () => {
    console.log(`App is listening at ${PORT}`);
});
