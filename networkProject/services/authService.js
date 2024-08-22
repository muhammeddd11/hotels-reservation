var jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const ApiError = require("../utils/apiError");
const userModel = require("../models/userModel");
const createtoken = require("../utils/createToken");

// @desc signup
// @Route Get /api/v1/auth
// @access public
exports.signup = asyncHandler(async (req, res) => {
  try {
    const { name, email, password, passwordConfirmation } = req.body;

    // 1. Check if name, email, and password are provided
    if (!name || !email || !password || !passwordConfirmation) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }

    // 2. Create User
    const user = await userModel.create({
      name,
      email,
      password,
    });

    // 3. Generate token
    const token = createtoken(user.id);

    // 4. Set user data in sessions
    req.session.authenticated = true;
    req.session.user = {
      email,
      name, // Assuming userModel has a "name" property
      token
    };

    // 5. Send response to client side
    res.status(201).json( req.session);
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// @desc login
// @Route Get /api/v1/auth
// @access public
exports.login = asyncHandler(async (req, res, next) => {
    console.log(req.sessionID);
  try {
    const { email, password } = req.body;

    // 1. Check if email and password are provided
    if (!email || !password) {
      return next(new ApiError("Email and password are required", 400));
    }

    // 2. Check if user exists and if the password is correct
    const user = await userModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new ApiError("Incorrect email or password", 401));
    }

    // 3. Generate token
    const token = createtoken(user.id);

    // 4. Initialize the session if it doesn't exist
    if (!req.session) {
      req.session = {};
    }

    // 5. Set user data in session
    req.session.authenticated = true;
    req.session.user = {
      email,
      name: user.name, // Assuming userModel has a "name" property
    };

    // 6. Save the session
    req.session.save((err) => {
      if (err) {
        console.error("Error saving session:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
      // 7. Send response to client side
      res.status(200).json(req.session);
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// @desc   make sure the user is logged in
exports.protect = asyncHandler(async (req, res, next) => {
  // 1) Check if token exist, if exist get
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 2) Verify token (no change happens, expired token)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // 3) Check if user exists
  const currentUser = await userModel.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError(
        "The user that belong to this token does no longer exist",
        401
      )
    );
  }

  req.user = currentUser;
  next();
});

// @desc    Authorization (User Permissions)
// ["vipMember"]
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    // 1) access roles
    // 2) access registered user (req.user.role)
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not allowed to access this route", 403)
      );
    }
    next();
  });
