import jwt from "jsonwebtoken";

const decodeSecureToken = async (
  token: string,
  email: string
): Promise<boolean> => {
  try {
    const secret = process.env.NEXT_PUBLIC_PROVIDER_EMAIL_VERIFICATION_SECRET;
    if (!secret) {
      throw new Error("JWT Secret key is not set");
    }

    const isValid = await new Promise<boolean>((resolve) => {
      jwt.verify(
        token,
        secret + email,
        { algorithms: ["HS256"] },
        (err, decoded) => {
          if (err) {
            console.error("JWT ERROR", err);
            resolve(false);
          } else {
            resolve(true);
          }
        }
      );
    });

    return isValid;
  } catch (error) {
    console.error("Error decoding token:", error);
    return false;
  }
};

export default decodeSecureToken;
