"use client";

import * as React from "react";
import { Controller, DefaultValues, FieldValues, Path, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ZodType } from "zod";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import Link from "next/link";
import ROUTES from "@/constants/routes";

interface AuthFormProps<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: Boolean }>;
  formType: "SIGN_IN" | "SIGN_UP";
}

const AuthForm = <T extends FieldValues>({
  schema,
  defaultValues,
  formType,
  onSubmit,
}: AuthFormProps<T>) => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: standardSchemaResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit = async (data: T) => {
    // TODO
  };

  let buttonText = formType === "SIGN_IN" ? "Sign In" : "Sign Up";

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className="mt-10 space-y-6"
    >
      <FieldGroup>
        {Object.keys(defaultValues).map((field) => (
          <Controller
            key={field}
            name={field as Path<T>}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="flex w-full flex-col gap-2.5"
              >
                <FieldLabel className="paragraph-medium text-dark400_light700">
                  {field.name === "email"
                    ? "Email address"
                    : field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                </FieldLabel>
                <Input
                  type={field.name === "password" ? "password" : "text"}
                  {...field}
                  className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 no-focus rounded-1.5 min-h-12 border"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        ))}
      </FieldGroup>
      <Button
        disabled={form.formState.isSubmitting}
        className="primary-gradient paragraph-medium rounded-2 font-inter text-light-900! min-h-12 w-full px-4 py-3"
      >
        {form.formState.isSubmitting
          ? buttonText === "Sign In"
            ? "Signin In..."
            : "Signing Up..."
          : buttonText}
      </Button>
      {formType === "SIGN_IN" ? (
        <p>
          Don't have an account?{" "}
          <Link
            href={ROUTES.SIGN_UP}
            className="paragraph-semibold primary-text-gradient"
          >
            Sign Up
          </Link>
        </p>
      ) : (
        <p>
          Already have an account?{" "}
          <Link
            href={ROUTES.SIGN_IN}
            className="paragraph-semibold primary-text-gradient"
          >
            Sign In
          </Link>
        </p>
      )}
    </form>
  );
};

export default AuthForm;
