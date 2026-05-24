import crypto from "crypto";

const ITERATIONS = 10000;
const KEY_LENGTH = 64;
const ALGORITHM = "sha512";

/**
 * Hashes a password using PBKDF2.
 * Returns a string formatted as "salt:hash"
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(
    password,
    salt,
    ITERATIONS,
    KEY_LENGTH,
    ALGORITHM
  ).toString("hex");
  
  return `${salt}:${hash}`;
}

/**
 * Verifies a password against a stored PBKDF2 hash.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const parts = storedHash.split(":");
    if (parts.length !== 2) {
      return false;
    }
    const [salt, hash] = parts;
    
    const verifyHash = crypto.pbkdf2Sync(
      password,
      salt,
      ITERATIONS,
      KEY_LENGTH,
      ALGORITHM
    ).toString("hex");
    
    return hash === verifyHash;
  } catch (error) {
    console.error("Error verifying password:", error);
    return false;
  }
}
