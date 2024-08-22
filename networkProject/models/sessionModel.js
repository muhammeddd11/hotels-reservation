/* // Function to store session data in database
exports.storeSession = async function (sessionId, userId) {
  const sessionSchema = new mongoose.Schema({
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiresAt: {
      type: Date,
      default: Date.now() + 1000 * 24 * 60 * 60, // Set expiration to 1 day from now (adjust as needed)
    },
  });

  const Session = mongoose.model("SessionModel", sessionSchema);

  const session = new Session({
    sessionId,
    userId,
  });

  try {
    await session.save();
  } catch (error) {
    console.error("Error storing session:", error);
    // Handle errors appropriately, potentially throwing an exception or returning an error code
  }
};
 */