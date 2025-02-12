"use client";

import FormInput from "@/components/elements/form/FormInput";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import YupPassword from "yup-password";
import FormPassword from "@/components/elements/form/FormPassword";
import BasicButton from "@/components/elements/buttons/BasicButton";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { User } from "@prisma/client";
import { useUserUpdate } from "@/lib/hooks/use-user";

YupPassword(Yup);

interface AccountDetailProps {
  user: User | null;
}

const AccountDetail: React.FC<AccountDetailProps> = ({ user }) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { mutate: updateUser, isPending: isLoading } = useUserUpdate();

  const formik = useFormik({
    initialValues: {
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      new_password: "",
      confirm_password: "",
    },

    validationSchema: Yup.object({
      name: Yup.string().required("Name required"),
      email: Yup.string()
        .required("Email required")
        .email("Invalid email format"),
      password: Yup.string()
        .required("Password Required")
        .min(8, "Password must be up to eight (8) characters")
        .minLowercase(1, "Password must contain at least 1 lower case letter")
        .minUppercase(1, "Password must contain at least 1 upper case letter")
        .minNumbers(1, "Password must contain at least 1 number")
        .minSymbols(1, "Password must contain at least 1 special character")
        .oneOf([Yup.ref("password")], "Passwords must match"),
      new_password: Yup.string()
        .required("Password Required")
        .minLowercase(1, "Password must contain at least 1 lower case letter")
        .minUppercase(1, "Password must contain at least 1 upper case letter")
        .minNumbers(1, "Password must contain at least 1 number")
        .min(8, "Password must be up to eight (8) characters")
        .minSymbols(1, "Password must contain at least 1 special character"),
      confirm_password: Yup.string()
        .required("Password Required")
        .minLowercase(1, "Password must contain at least 1 lower case letter")
        .minUppercase(1, "Password must contain at least 1 upper case letter")
        .minNumbers(1, "Password must contain at least 1 number")
        .min(8, "Password must be up to eight (8) characters")
        .minSymbols(1, "Password must contain at least 1 special character")
        .oneOf([Yup.ref("new_password")], "Passwords must match"),
    }),
    onSubmit: () => {},
  });

  const handleNameUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSubmitting(true);

    const { name } = formik.values;

    if (!name || name === "" || formik.errors.name) {
      setSubmitting(false);
      return;
    }
    updateUser({
      name: formik.values.name,
    });
  };
  const handlePasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSubmitting(true);

    const { password, new_password, confirm_password } = formik.values;

    if (
      !password ||
      password === "" ||
      new_password === "" ||
      confirm_password === "" ||
      !new_password ||
      new_password !== confirm_password ||
      formik.errors.password ||
      formik.errors.confirm_password ||
      formik.errors.new_password
    ) {
      setSubmitting(false);
      return;
    }

    if (password === new_password) {
      setSubmitting(false);
      toast.warning("New password cannot be the same as old password", {
        autoClose: 2500,
      });
      return;
    }
  };

  React.useEffect(() => {
    formik.setFieldValue("email", user?.email);
    formik.setFieldValue("name", user?.name);
  }, [user]);

  return (
    <div
      className={
        "py-8 px-14 max-w-2xl mx-auto rounded-2xl bg-white settings--form--gradient"
      }
    >
      <form className={`flex flex-col gap-5`}>
        <div className={`w-full flex flex-col gap-4`}>
          <FormInput
            id={"name"}
            name={"name"}
            labelFont={`mulish--semibold`}
            label={"Name"}
            placeholder={"Name"}
            handleBlur={() => formik.handleBlur("name")}
            handleChange={formik.handleChange}
            value={formik.values.name}
            fieldError={!!(formik.touched.name && formik.errors.name)}
          />
          <BasicButton
            text={"Update name"}
            width={"w-fit self-end"}
            bgColor={"bg-brandBlue2x"}
            borderRadius={`rounded-10`}
            disabled={isLoading}
            handleClick={(e) => {
              e.preventDefault();
              handleNameUpdate(
                e as unknown as React.FormEvent<HTMLFormElement>
              );
            }}
          />
        </div>
      </form>
      <form className={`flex flex-col gap-5`}>
        <div className={`w-full flex flex-col gap-4`}>
          <FormInput
            id={"email"}
            type={"email"}
            name={"email"}
            placeholder={"Email"}
            handleBlur={() => formik.handleBlur("email")}
            handleChange={formik.handleChange}
            labelFont={`mulish--semibold`}
            label={"Email"}
            value={formik.values.email}
            fieldError={!!(formik.touched.email && formik.errors.email)}
            disabled={true}
            className="mb-10"
          />
        </div>
      </form>

      {/* <div className={`pt-8 mx-auto flex items-center justify-center`}>
        <button
          disabled={submitting}
          type="button"
          className="text-lg px-6 py-3 w-full text-center mulish--semibold bg-brandRed3x text-white rounded-xl"
        >
          Delete Account
        </button>
      </div> */}
      <ToastContainer />
    </div>
  );
};

export default AccountDetail;
