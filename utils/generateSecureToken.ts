import jwt from "jsonwebtoken";

interface TokenPayload {
  id: string;
}

const generateSecureToken = (id: string, email: string): string => {
  const payload: TokenPayload = { id };
  const secret =
    process.env.NEXT_PUBLIC_PROVIDER_EMAIL_VERIFICATION_SECRET + email;

  if (!secret) {
    throw new Error("Missing email verification secret");
  }

  return jwt.sign(payload, secret, {
    expiresIn: "1h",
    algorithm: "HS256",
  });
};

export default generateSecureToken;
