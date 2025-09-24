import express from "express";
//import { createServer } from "http"; // Import the 'createServer' function
//import { Server } from "socket.io"; // Import the 'Server' class from 'socket.io'
import { PORT, mongoDBUrl } from "./config.js";
import cors from "cors";
import mongoose from "mongoose";
import passport from "passport";
import session from "express-session";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "./api/models/userModel.js";
import workoutRoutes from "./api/routes/workoutRoute.js";
import userRoutes from "./api/routes/userRoute.js";
import packcageRoutes from "./api/routes/packageRoutes.js";
import approvalRoutes from "./api/routes/approvalRoutes.js";
import wkGoalsRoutes from "./api/routes/wkGoalRoutes.js";
import bioDataRoutes from "./api/routes/bioDataRoutes.js";
import ItemRoutes from "./api/routes/item.js";
import CartRoutes from "./api/routes/cart.js";
import appointmentRoutes from "./api/routes/appointmentRoutes.js";
import trainerRouter from "./api/routes/trainerRoutes.js";
import deliveryRoutes from "./api/routes/deliveryRoutes.js";
import cardRoutes from "./api/routes/cardRoutes.js";
import saveCardRoutes from "./api/routes/saveCardRoutes.js";
import paymentRoutes from "./api/routes/paymentRoutes.js";
import injuryRoutes from "./api/routes/injuryRoutes.js";
import docAppointment from "./api/routes/docAppRoutes.js";
import physioAppointment from "./api/routes/physioAppRoutes.js";
import feedbackRoutes from "./api/routes/feedbackRoutes.js"
import offerRoutes from "./api/routes/offerRoutes.js"
//import sendEmail from "./api/routes/emailRoutes.js"

const app = express();
//const server = createServer(app); // Create an HTTP server instance
//const io = new Server(server); // Create a new instance of the Socket.IO server

//middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173", // Update to your frontend port
  credentials: true
}));
app.use(express.static("public"));

//session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || "your_secret",
  resave: false, 
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 24 * 60 * 60 * 1000
  }
}));
app.use(passport.initialize());
app.use(passport.session());

//configure Google strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
},
async function(accessToken, refreshToken, profile, done){
  try {
    // Check if user already exists with Google ID
    let user = await User.findOne({ googleId: profile.id });
    
    if (user) {
      return done(null, user);
    } else {
      // Check if user exists with same email
      user = await User.findOne({ email: profile.emails[0].value });
      
      if (user) {
        // Link Google account to existing user
        user.googleId = profile.id;
        await user.save();
        return done(null, user);
      } else {
        // Create new user
        let username = profile.emails[0].value.split('@')[0];
        
        // Check if username already exists and make it unique
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
          username = `${username}_${Date.now()}`;
        }
        
        const newUser = new User({
          googleId: profile.id,
          fullName: profile.displayName,
          username: username, // Use the unique username
          email: profile.emails[0].value,
          role: 'customer',
          // Remove password field - not required for OAuth users
        });
        
        const savedUser = await newUser.save();
        return done(null, savedUser);
      }
    }
  } catch (error) {
    return done(error, null);
  }
}));

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

//Google OAuth routes
app.get("/auth/google", passport.authenticate("google", {scope: ["profile", "email"]}));

app.get("/auth/google/callback", passport.authenticate("google", {failureRedirect: "http://localhost:5173/login"}),
(req, res) => {
  // Successful authentication - redirect to frontend
  res.redirect("http://localhost:5173/dashboard"); // Update to port 5173
});

app.get("/auth/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: err });
    res.redirect("http://localhost:5173/"); // Update to port 5173
  });
});

app.get("/auth/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

app.get("/", (req, res) => {
  return res.status(234).send("hello world");
});

// Route handler
app.use("/api/users", userRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/packages", packcageRoutes);
app.use("/approval", approvalRoutes);
app.use("/workoutGoals", wkGoalsRoutes);
app.use("/biodata", bioDataRoutes);
app.use("/product", ItemRoutes);
app.use("/carts", CartRoutes);
app.use("/appointmentsbook", appointmentRoutes);
app.use("/trainer", trainerRouter);
app.use("/delivery", deliveryRoutes);
app.use("/card", cardRoutes);
app.use("/savecard", saveCardRoutes);
app.use("/payment", paymentRoutes);
app.use("/postworkout", injuryRoutes);
app.use("/docappointment", docAppointment);
app.use("/physio", physioAppointment);
app.use("/feedback", feedbackRoutes);
app.use("/offer", offerRoutes)

// WebSocket event handler
/*io.on("connection", (socket) => {
  console.log("A client connected");

  socket.on("disconnect", () => {
    console.log("A client disconnected");
  });

  // Handle custom events from clients
  socket.on("customEvent", (data) => {
    console.log("Received custom event:", data);
    // Process data and optionally emit a response or broadcast to other clients
  });

  
  // Example: Emitting approvalUpdate event
  socket.emit("approvalUpdate", updatedApprovals);
});*/

mongoose
  .connect(mongoDBUrl)
  .then(() => {
    console.log("App connected to database");
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
