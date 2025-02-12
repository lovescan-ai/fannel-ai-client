"use client";

import React from "react";
import { useFormik } from "formik";
import { toast } from "sonner";

import AuthText from "@/components/elements/sections/AuthText";
import FormInput from "@/components/elements/form/FormInput";
import FormPassword from "@/components/elements/form/FormPassword";
import AuthButton from "@/components/elements/buttons/AuthButton";
import AltAuthPage from "@/components/elements/form/AltAuthPage";
import { signUpSchema } from "@/data/formikSchemas/signUpSchema";
import useAuth from "@/lib/hooks/use-auth";

interface FormValues {
  full_name: string;
  email: string;
  password: string;
}

const SignUpForm: React.FC = () => {
  const { handleSignUp, handleGoogleLogin, isLoading, activeMethod } =
    useAuth();

  const formik = useFormik<FormValues>({
    initialValues: {
      full_name: "",
      email: "",
      password: "",
    },
    validationSchema: signUpSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        console.log("Credentials", values);
        await handleSignUp(values.email, values.password, values.full_name);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred during signup");
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleGoogleSignUp = async () => {
    try {
      await handleGoogleLogin();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred during Google signup");
      }
    }
  };

  return (
    <div>
      <AuthText
        buttonType="button"
        btnBgColor="bg-white"
        btnTextColor="text-black"
        btnBorderRadius="rounded-2xl"
        btnBorder="border-1 border-black/40"
        hasIcon
        disabled={isLoading || activeMethod === "google"}
        handleClick={handleGoogleSignUp}
        buttonText="Sign in with Google"
      />

      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col gap-5 mx-auto pt-7"
      >
        <FormInput
          id="full_name"
          name="full_name"
          handleBlur={formik.handleBlur}
          handleChange={formik.handleChange}
          placeholder="Full Name"
          value={formik.values.full_name}
          fieldError={!!(formik.touched.full_name && formik.errors.full_name)}
        />
        <FormInput
          id="email"
          type="email"
          name="email"
          handleBlur={formik.handleBlur}
          handleChange={formik.handleChange}
          placeholder="Email address"
          value={formik.values.email}
          fieldError={!!(formik.touched.email && formik.errors.email)}
        />
        <FormPassword
          id="password"
          name="password"
          handleBlur={() => formik.handleBlur("password")}
          handleChange={formik.handleChange}
          eyeIcon
          placeholder="Password"
          value={formik.values.password}
          fieldError={!!(formik.touched.password && formik.errors.password)}
        />
        <AuthButton
          btnText="Sign Up"
          loading={isLoading}
          bgColor="bg-brandBlue2x"
          disabled={
            isLoading ||
            activeMethod === "google" ||
            !(
              formik.values.email &&
              formik.values.full_name &&
              formik.values.password
            )
          }
          handleClick={formik.handleSubmit}
        />
      </form>
      <AltAuthPage
        id="signupAltAuth"
        text="Already have an Account?"
        linkText="Sign in"
        link="/auth/signin"
        textSize="text-sm"
        textPos="text-center"
      />
    </div>
  );
};

export default SignUpForm;
