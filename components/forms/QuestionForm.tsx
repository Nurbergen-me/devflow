"use client";
import { Controller, Path, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AskQuestionSchema } from "@/lib/validations";
import { Form } from "@/components/ui/form";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { useRef } from "react";
import dynamic from "next/dynamic";
import { z } from "zod";
import TagCard from "@/components/cards/TagCard";

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});

const QuestionForm = () => {
  const editorRef = useRef<MDXEditorMethods>(null);
  const form = useForm<z.infer<typeof AskQuestionSchema>>({
    resolver: zodResolver(AskQuestionSchema),
    defaultValues: { title: "", content: "", tags: [] },
  });

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: { value: string[] }
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const tagInput = e.currentTarget.value.trim();

      if (tagInput && tagInput.length < 15 && !field.value.includes(tagInput)) {
        form.setValue("tags", [...field.value, tagInput]);
        e.currentTarget.value = "";
        form.clearErrors("tags");
      } else if (tagInput.length >= 15) {
        form.setError("tags", { type: "manual", message: "Tag should be less than 15 characters" });
      } else if (field.value.includes(tagInput)) {
        form.setError("tags", { type: "manual", message: "Tag already exists" });
      }
    }
  };

  const handleRemoveTag = (tag: string, field: { value: string[] }) => {
    const newTags = field.value.filter((t) => t !== tag);

    form.setValue("tags", newTags);
    if (newTags.length === 0) {
      form.setError("tags", { type: "manual", message: "Tags are required" });
    }
  };

  const handleCreateQuestion = (data: z.infer<typeof AskQuestionSchema>) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form
        className="flex w-full flex-col gap-10"
        onSubmit={form.handleSubmit(handleCreateQuestion)}
      >
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="flex w-full flex-col"
            >
              <FieldLabel className="paragraph-semibold text-dark400_light700">
                Question title<span className="text-primary-500">*</span>
              </FieldLabel>
              <Input
                className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-14 border"
                {...field}
              />
              <FieldDescription className="body-regular text-light-500 mt-2.5">
                Be specific and imagine you’re asking a question to another person.
              </FieldDescription>
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
        <Controller
          name="content"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="flex w-full flex-col"
            >
              <FieldLabel className="paragraph-semibold text-dark400_light700">
                Detailed explanation of your problem<span className="text-primary-500">*</span>
              </FieldLabel>
              <Editor
                value={field.value}
                fieldChange={field.onChange}
                editorRef={editorRef}
              />
              <FieldDescription className="body-regular text-light-500 mt-2.5">
                Introduce the problem and expand on what you're put in the title.
              </FieldDescription>
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
        <Controller
          name="tags"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="flex w-full flex-col gap-3"
            >
              <FieldLabel className="paragraph-semibold text-dark400_light700">
                Tags<span className="text-primary-500">*</span>
              </FieldLabel>
              <div>
                <Input
                  className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-14 border"
                  onKeyDown={(e) => {
                    handleInputKeyDown(e, field);
                  }}
                />

                <div className="flex-start mt-2.5 flex-wrap gap-2.5">
                  {field.value.length > 0 &&
                    field.value.map((tag: string) => (
                      <TagCard
                        key={tag}
                        _id={tag}
                        name={tag}
                        compact
                        remove
                        isButton
                        handleRemove={() => handleRemoveTag(tag, field)}
                      />
                    ))}
                </div>
                {fieldState.invalid && (
                  <FieldError
                    errors={[fieldState.error]}
                    className="mt-2.5"
                  />
                )}
              </div>
              <FieldDescription className="body-regular text-light-500 mt-2.5">
                At up to 3 tags to describe what your question is about. You need to press enter to
                add a tag.
              </FieldDescription>
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
        <div className="mt-16 flex justify-end">
          <Button
            type="submit"
            className="primary-gradient text-light-900 w-fit"
          >
            Ask a Question
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default QuestionForm;
