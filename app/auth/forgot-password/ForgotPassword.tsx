"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import AuthText from "@/components/elements/sections/AuthText";
import FormInput from "@/components/elements/form/FormInput";
import AuthButton from "@/components/elements/buttons/AuthButton";
import useAuth from "@/lib/hooks/use-auth";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const { handleForgotPassword } = useAuth();
  const formik = useFormik({
    initialValues: {
      email_address: "",
    },
    validationSchema: Yup.object({
      email_address: Yup.string()
        .required("Email is required")
        .email("Invalid email format"),
    }),
    onSubmit: async (values) => {
      setLoading(true);

      await handleForgotPassword(values.email_address);
      formik.resetForm();
      setLoading(false);
    },
  });

  return (
    <div>
      <AuthText header="Forgot Password" text="" noButton noBorder />
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
        <FormInput
          id="email_address"
          type="email"
          name="email_address"
          handleBlur={formik.handleBlur}
          handleChange={formik.handleChange}
          placeholder="Email address"
          value={formik.values.email_address}
          error={formik.touched.email_address && formik.errors.email_address}
          className="mulish--regular"
        />
        <AuthButton
          btnText="Send reset email"
          bgColor="bg-brandBlue2x"
          loading={loading}
          type="submit"
          disabled={loading || !formik.isValid || !formik.dirty}
        />
      </form>
    </div>
  );
};

export default ForgotPassword;
