const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
require("dotenv").config();

const discountRoutes = require("./routes/DiscountRoutes");
const adminDiscountRoutes = require("./routes/AdminDiscount");
const chatBotRoutes = require("./routes/AiBotRoute.js");

const helmet = require("helmet");

const cookieParser = require("cookie-parser");
const app = express();
const corsOpts = {
  origin: "http://localhost:5173",          // exact origin (no *)
  credentials: true,                         // allow cookies/Authorization
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
};
app.use(cors(corsOpts));
app.options("*", cors(corsOpts));            // handle preflight globally

app.use(cookieParser());
app.use(express.json());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://cdn.jsdelivr.net",
          "http://localhost:5173",
        ],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: [
          "'self'",
          "http://localhost:5173",
          "http://localhost:3001",
        ],
        frameSrc: ["'self'"],
      },
    },
  })
);

const productRoutes = require("./routes/productRoutes.js");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");


const loginRoutes = require("./Routes/UserLoginRoute.js");

const userRouter = require("./routes/UserManagmentRoute.js");
const userProfile = require("./routes/UserProfileRoutes.js");

const app = express();
app.disable("x-powered-by"); // to hide Express

app.use((req, res, next) => {
  console.log("A new request received at " + Date.now());
  console.log(req.path , req.method);
  next();
});

// Helmet to set secure HTTP headers
app.use(helmet());

// Sanitize to defends against injection attacks.
app.use(mongoSanitize());

// Prevent XSS
app.use(xss());

// Limit JSON body size to prevents DoS with large payloads.
app.use(express.json({ limit: "10kb" }));

// Configure CORS properly
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  optionsSuccessStatus: 200,
}; 
app.use(cors(corsOptions));

// Discount routes
app.use("/api/chatbot", chatBotRoutes);
app.use("/api/discount", discountRoutes);
app.use("/api/admindis", adminDiscountRoutes);


// Apply rate limiting to all API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests. Try again later.',
});

app.use("/api", apiLimiter);

//routes
app.get("/", (req, res) => {
  res.send("Hello from the hardened backend!");
});

app.use("/Products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/order", orderRoutes);
app.use("/login", loginRoutes);
app.use("/user", userRouter);
app.use("/userProfile", userProfile);
app.use("/api/chatbot", chatBotRoutes);
app.use("/api/discount", discountRoutes);
app.use("/api/admindis", adminDiscountRoutes);

//mongodb connection
const PORT = process.env.PORT || 3001;
const URL = process.env.MONGODB_URL;

mongoose
  .connect(URL)
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server running securely on port ${PORT}`)
    );
  })
  .catch((error) => console.error("MongoDB Connection Failed:", error.message));

mongoose.connection.once("open", () => {
  console.log("MongoDB Connection Success!");
});

