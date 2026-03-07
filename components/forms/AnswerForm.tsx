"use client";

import { auth } from "@/auth";
import { createAnswer } from "@/lib/actions/answer.action";
import { api } from "@/lib/api";
import { useSession } from "next-auth/react";
import React, { useRef, useState, useTransition } from "react";
import { Form } from "@/components/ui/form";
import { Controller, useForm } from "react-hook-form";
import { AnswerSchema } from "@/lib/validations";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MDXEditorMethods } from "@mdxeditor/editor";
import dynamic from "next/dynamic";
import { Field, FieldError } from "@/components/ui/field";
import { ReloadIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface Props {
  questionId: string;
  questionTitle: string;
  questionContent: string;
}

const AnswerForm = ({ questionId, questionTitle, questionContent }: Props) => {
  const [isAnswering, startAnsweringTransition] = useTransition();
  const [isAISubmitting, setIsAISubmitting] = useState(false);
  const session = useSession();

  const editorRef = useRef<MDXEditorMethods>(null);

  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      content: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof AnswerSchema>) => {
    startAnsweringTransition(async () => {
      const result = await createAnswer({
        questionId,
        content: data.content,
      });

      if (result.success) {
        form.reset();
        toast.success("Your answer has been posted successfully");

        if (editorRef.current) {
          editorRef.current.setMarkdown("");
        }
      } else {
        toast.error(result.error?.message || "Something went wrong");
      }
    });
  };

  const generateAIAnswer = async () => {
    if (session.status !== "authenticated") {
      return toast.error("You need to be logged in to generate an AI answer");
    }
    setIsAISubmitting(true);

    const userAnswer = editorRef.current?.getMarkdown();

    try {
      const { success, data, error } = await api.ai.getAnswer(
        questionTitle,
        questionContent,
        userAnswer
      );
      if (!success) toast.error(error?.message || "Failed to generate AI answer");

      const formattedAnswer = data?.replace(/<br>/g, " ").toString().trim() || "";

      if (editorRef.current) {
        editorRef.current.setMarkdown(formattedAnswer);
        form.setValue("content", formattedAnswer);
        await form.trigger("content");
      }
      toast.success("AI answer generated successfully");
    } catch (error) {
      toast.error("Failed to generate AI answer");
    } finally {
      setIsAISubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="paragraph-semibold text-dark400_light800">Write your answer here</h4>
        <Button
          className="btn light-border-2 text-primary-500 dark:text-primary-500 gap-1.5 rounded-md border px-4 py-2.5 shadow-none"
          disabled={isAISubmitting}
          onClick={generateAIAnswer}
        >
          {isAISubmitting ? (
            <>
              <ReloadIcon className="mr-2 size-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Image
                src="/icons/stars.svg"
                alt="Generate AI Answer"
                width={12}
                height={12}
                className="object-contain"
              />
              Generate AI Answer
            </>
          )}
        </Button>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="mt-6 flex w-full flex-col gap-10"
        >
          <Controller
            name="content"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field className="mt-3.5 flex w-full flex-col gap-3">
                <Editor
                  value={field.value}
                  fieldChange={field.onChange}
                  editorRef={editorRef}
                />
                <FieldError errors={[fieldState.error]} /> {field.value.length}
              </Field>
            )}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              className="primary-gradient w-fit"
            >
              {isAnswering ? (
                <>
                  <ReloadIcon className="mr-2 size-4 animate-spin" />
                  Posting...
                </>
              ) : (
                "Post Answer"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
export default AnswerForm;
