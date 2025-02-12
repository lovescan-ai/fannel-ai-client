"use client";

import AuthText from "@/components/elements/sections/AuthText";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import YupPassword from "yup-password";
import FormInput from "@/components/elements/form/FormInput";
import AuthButton from "@/components/elements/buttons/AuthButton";
import FormSelect from "@/components/elements/form/FormSelect";
import { useRouter, useSearchParams } from "next/navigation";
import { useUpdateCreator } from "@/lib/hooks/use-creator";
import { Gender } from "@prisma/client";

YupPassword(Yup);

interface FormValues {
  creator_name: string;
  creator_onlyfans_url: string;
  creator_gender: string;
}

const CreatorDetails = () => {
  const [__, setSubmitting] = useState(false);
  const query = useSearchParams();
  const router = useRouter();
  const { mutate, isPending } = useUpdateCreator();

  const formik = useFormik({
    initialValues: {
      creator_name: "",
      creator_onlyfans_url: "",
      creator_gender: "",
    },
    validationSchema: Yup.object({
      creator_name: Yup.string().required("Name required"),
      creator_onlyfans_url: Yup.string()
        .required("URL required")
        .url("Invalid URL format"),
      creator_gender: Yup.string().required("Gender required"),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const handleSubmit = async (values: FormValues) => {
    setSubmitting(true);

    const { creator_name, creator_gender, creator_onlyfans_url } = values;

    if (
      !creator_name ||
      creator_name == "" ||
      !creator_gender ||
      creator_gender == "" ||
      !creator_onlyfans_url ||
      creator_onlyfans_url == "" ||
      Object.keys(formik.errors).length !== 0
    ) {
      return;
    }
    mutate({
      creatorId: query.get("id") as string,
      data: {
        name: creator_name,
        onlyFansUrl: creator_onlyfans_url,
        gender: creator_gender.toUpperCase() as Gender,
      },
    });
    router.push("pricing");
  };

  return (
    <div>
      <AuthText
        header={"Creators details"}
        text={"Tell us more about yourself"}
        noButton
        noBorder
      />
      <form className="flex flex-col gap-5 max-w-2xl pt-7">
        <FormInput
          id={"creator_name"}
          name={"creator_name"}
          handleBlur={formik.handleBlur}
          handleChange={formik.handleChange}
          placeholder={"Creator Name"}
          value={formik.values.creator_name}
          fieldError={
            !!(formik.touched.creator_name && formik.errors.creator_name)
          }
          errorMessage={
            formik.touched.creator_name && formik.errors.creator_name
          }
        />
        <FormInput
          id={"creator_onlyfans_url"}
          name={"creator_onlyfans_url"}
          handleBlur={formik.handleBlur}
          handleChange={formik.handleChange}
          placeholder={"OnlyFans URL"}
          value={formik.values.creator_onlyfans_url}
          fieldError={
            !!(
              formik.touched.creator_onlyfans_url &&
              formik.errors.creator_onlyfans_url
            )
          }
          errorMessage={
            formik.touched.creator_onlyfans_url &&
            formik.errors.creator_onlyfans_url
          }
        />
        <FormSelect
          id="creator_gender"
          name="creator_gender"
          handleBlur={formik.handleBlur}
          handleChange={formik.handleChange}
          value={formik.values.creator_gender}
          fieldError={
            !!(formik.touched.creator_gender && formik.errors.creator_gender)
          }
          fieldsetId="creator_gender_fieldset"
          label="Gender"
          labelFont="font-normal"
          labelColor="text-gray-700"
          borderRadius="rounded-md"
          border="border-gray-300"
          moreInputClasses=""
          required={true}
          padding="px-3 py-2"
        >
          <option value={""}>Gender</option>
          <option value={"Male"}>Male</option>
          <option value={"Female"}>Female</option>
          <option value={"Prefer not to say"}>Prefer not to say</option>
        </FormSelect>
        <AuthButton
          disabled={isPending}
          btnText={"Save and Proceed"}
          bgColor={"bg-brandBlue2x"}
          handleClick={formik.handleSubmit}
        />
      </form>
    </div>
  );
};

export default CreatorDetails;
