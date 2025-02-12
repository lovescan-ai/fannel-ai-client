"use client";
import { toast } from "sonner";
import AuthText from "@/components/elements/sections/AuthText";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import YupPassword from "yup-password";
import FormPassword from "@/components/elements/form/FormPassword";
import AuthButton from "@/components/elements/buttons/AuthButton";
import supabase from "@/lib/supabase/supabase";
import { useRouter } from "next/navigation";

YupPassword(Yup);

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      password: "",
      confirm_password: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .required("Password Required")
        .minLowercase(1, "Password must contain at least 1 lower case letter")
        .minUppercase(1, "Password must contain at least 1 upper case letter")
        .minNumbers(1, "Password must contain at least 1 number")
        .minSymbols(1, "Password must contain at least 1 special character")
        .min(8, "Password must be up to eight (8) characters"),
      confirm_password: Yup.string()
        .required("Password Required")
        .minLowercase(1, "Password must contain at least 1 lower case letter")
        .minUppercase(1, "Password must contain at least 1 upper case letter")
        .minNumbers(1, "Password must contain at least 1 number")
        .min(8, "Password must be up to eight (8) characters")
        .minSymbols(1, "Password must contain at least 1 special character")
        .oneOf([Yup.ref("password")], "Passwords must match"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const { error } = await supabase.auth.updateUser({
          password: values.password,
        });
        if (error) throw Error(error.message);
        toast.success("Password reset successful");
        router.push("/dashboard");
      } catch (error) {
        toast.error("Failed to reset password");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div>
      <AuthText
        header={"Reset Password"}
        text={"It's okay to forget sometimes"}
        noButton
        noBorder
      />
      <form className="flex flex-col gap-5 w-full pt-7">
        <FormPassword
          id={"password"}
          name={"password"}
          handleBlur={() => formik.handleBlur("password")}
          handleChange={formik.handleChange}
          eyeIcon
          placeholder={"New Password"}
          value={formik.values.password}
          fieldError={!!(formik.touched.password && formik.errors.password)}
        />
        <FormPassword
          id={"confirm_password"}
          name={"confirm_password"}
          handleBlur={() => formik.handleBlur("confirm_password")}
          handleChange={formik.handleChange}
          eyeIcon
          placeholder={"Confirm New Password"}
          value={formik.values.confirm_password}
          fieldError={
            !!(
              formik.touched.confirm_password && formik.errors.confirm_password
            )
          }
        />
        <AuthButton
          btnText={"Reset Password"}
          bgColor={"bg-brandBlue2x"}
          handleClick={formik.handleSubmit}
          loading={loading}
          disabled={loading || !formik.isValid}
        />
      </form>
    </div>
  );
};

export default ResetPassword;
