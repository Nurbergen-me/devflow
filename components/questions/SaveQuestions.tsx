"use client";

import { toggleSaveQuestion } from "@/lib/actions/collection.action";
import { ActionResponse } from "@/types/global";
import { Promise } from "mongoose";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { use, useState } from "react";
import { toast } from "sonner";

interface Props {
  questionId: string;
  hasSavedPromise: Promise<ActionResponse<{ saved: boolean }>>;
}

const SaveQuestions = ({ questionId, hasSavedPromise }: Props) => {
  const session = useSession();
  const userId = session.data?.user?.id;

  const [isLoading, setIsLoading] = useState(false);

  const { data: hasSavedData } = use(hasSavedPromise);
  const hasSaved = hasSavedData?.saved;

  const handleSave = async () => {
    if (isLoading) return;
    if (!userId) return toast.error("You need to be logged in to save questions");

    setIsLoading(true);

    try {
      const { success, data, error } = await toggleSaveQuestion({ questionId });
      if (!success) throw new Error(error?.message || "An error occurred");

      toast.success(`Question ${data?.saved ? "saved" : "unsaved"} successfully`, {
        position: "top-center",
      });
    } catch (error) {
      toast.error("Failed to save question");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Image
      src={hasSaved ? "/icons/star-filled.svg" : "/icons/star-red.svg"}
      width={18}
      height={18}
      alt="save"
      className={`cursor-pointer ${isLoading && "opacity-50"}`}
      aria-label="Save question"
      onClick={handleSave}
    />
  );
};
export default SaveQuestions;
