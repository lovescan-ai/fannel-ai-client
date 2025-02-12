import * as Yup from "yup";

export const signUpSchema = Yup.object().shape({
  full_name: Yup.string().required("Name is required"),
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Password must contain at least 1 lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least 1 uppercase letter")
    .matches(/[0-9]/, "Password must contain at least 1 number")
    .matches(
      /[^a-zA-Z0-9]/,
      "Password must contain at least 1 special character"
    ),
});
