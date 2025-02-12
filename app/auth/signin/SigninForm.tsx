"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import YupPassword from "yup-password";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import AuthText from "@/components/elements/sections/AuthText";
import FormInput from "@/components/elements/form/FormInput";
import FormPassword from "@/components/elements/form/FormPassword";
import AuthButton from "@/components/elements/buttons/AuthButton";
import AltAuthPage from "@/components/elements/form/AltAuthPage";
import { loginSchema } from "@/data/formikSchemas/loginSchema";
import useAuth from "@/lib/hooks/use-auth";

YupPassword(Yup);

const LoginForm = () => {
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { handleSignIn, handleGoogleLogin, isLoading, activeMethod } =
    useAuth();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object(loginSchema(Yup)),
    onSubmit: async (values) => {
      await handleSubmit(values);
    },
  });

  const handleSubmit = async (values: { email: string; password: string }) => {
    const { email, password } = values;

    if (!email || !password || Object.keys(formik.errors).length !== 0) {
      return;
    }

    setSubmitting(true);
    try {
      await handleSignIn(email, password);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred during login");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await handleGoogleLogin();
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Account not found. Please sign up.");
      } else {
        toast.error("An unexpected error occurred during Google login");
      }
    }
  };

  return (
    <div>
      <AuthText
        buttonType="button"
        header="Sign In"
        btnBgColor="bg-white"
        btnTextColor="text-black"
        btnBorderRadius="rounded-2xl"
        btnBorder="border-1 border-black/40"
        hasIcon
        disabled={isLoading}
        text="Welcome back, sign in to continue"
        buttonText={
          isLoading && activeMethod === "google"
            ? "Signing in with google"
            : "Sign in with Google"
        }
        handleClick={handleGoogleSignIn}
      />
      <div className="flex flex-col gap-5 w-full mx-auto pt-7">
        <FormInput
          id="email"
          type="email"
          name="email"
          handleBlur={formik.handleBlur}
          handleChange={formik.handleChange}
          placeholder="Email address"
          value={formik.values.email}
          fieldError={!!(formik.touched.email && formik.errors.email)}
          fieldsetId=""
          display="block"
          colSpan="1"
          rowSpan="1"
          required={false}
          maxLength={100}
          labelColor="text-gray-700"
        />
        <FormPassword
          id="password"
          name="password"
          forgot
          handleBlur={() => formik.handleBlur}
          handleChange={formik.handleChange}
          eyeIcon
          placeholder="Password"
          value={formik.values.password}
          fieldError={!!(formik.touched.password && formik.errors.password)}
        />
        <AuthButton
          disabled={submitting || isLoading || !formik.isValid}
          loading={submitting || isLoading}
          type="submit"
          btnText="Sign In"
          bgColor="bg-brandBlue2x"
          handleClick={formik.handleSubmit}
        />
      </div>
      <AltAuthPage
        id="signupLink"
        text="Don't have an Account?"
        linkText="Sign Up"
        link="/auth/signup"
        textSize="text-sm"
        textPos="text-center"
      />
    </div>
  );
};

export default LoginForm;
