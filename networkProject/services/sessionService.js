/* // Function to validate session data
exports.validateSession = async function (sessionId) {
  const Session = mongoose.model("SessionModel");

  try {
    const session = await Session.findOne({ sessionId }).populate("userId"); // Populate user data if needed
    if (session && session.expiresAt > Date.now()) {
      return true; // Session is valid and not expired
    } else {
      return false; // Session not found or expired
    }
  } catch (error) {
    console.error("Error validating session:", error);
    return false; // Handle errors appropriately
  }
};

// Function to generate a unique session ID
exports.generateSessionId = function () {
  // Use crypto library to generate a random hex string
  return crypto.randomBytes(16).toString("hex");
};
 */