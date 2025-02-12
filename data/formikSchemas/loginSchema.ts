import * as Yup from "yup";

export const loginSchema = (validator: typeof Yup) => {
  return {
    email: validator
      .string()
      .required("Email required")
      .email("Invalid email format"),
    password: validator
      .string()
      .required("Password Required")
      .min(8, "Password must be up to eight (8) characters")
      .minLowercase(1, "Password must contain at least 1 lower case letter")
      .minUppercase(1, "Password must contain at least 1 upper case letter")
      .minNumbers(1, "Password must contain at least 1 number")
      .minSymbols(1, "Password must contain at least 1 special character"),
  };
};
