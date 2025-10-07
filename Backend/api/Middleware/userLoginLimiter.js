// Middleware/userLoginLimiter.js

// In-memory failed login store (use Redis or DB for production)
const failedLogins = {};

/**
 * Middleware: Check if a user has exceeded login attempts
 */
export function checkUserAttempts(req, res, next) {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const now = Date.now();
  const attempt = failedLogins[email];

  if (attempt) {
    // If user exceeded attempts in the last 15 mins → block
    if (attempt.count >= 5 && now - attempt.lastAttempt < 15 * 60 * 1000) {
      return res
        .status(429)
        .json({ message: "Too many failed login attempts. Try again later." });
    }

    // If 15 minutes passed since last attempt → reset counter
    if (now - attempt.lastAttempt >= 15 * 60 * 1000) {
      delete failedLogins[email];
    }
  }

  next(); // allow login attempt
}

/**
 * Record a failed login attempt for a user
 */
export function recordFailedAttempt(email) {
  const now = Date.now();
  if (!failedLogins[email]) {
    failedLogins[email] = { count: 1, lastAttempt: now };
  } else {
    failedLogins[email].count += 1;
    failedLogins[email].lastAttempt = now;
  }
}

/**
 * Reset login attempts for a user (on successful login)
 */
export function resetAttempts(email) {
  delete failedLogins[email];
}
