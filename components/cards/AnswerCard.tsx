import { Preview } from "@/components/editor/Preview";
import EditDeleteAction from "@/components/user/EditDeleteAction";
import UserAvatar from "@/components/UserAvatar";
import Votes from "@/components/votes/Votes";
import ROUTES from "@/constants/routes";
import { hasVoted } from "@/lib/actions/vote.action";
import { cn, getTimeStamp } from "@/lib/utils";
import { IAnswer } from "@/types/global";
import Link from "next/link";
import React, { Suspense } from "react";

interface Props extends IAnswer {
  containerClasses: string;
  showReadMore?: boolean;
  showActionBtns?: boolean;
}

const AnswerCard = ({
  _id,
  content,
  author,
  createdAt,
  upvotes,
  downvotes,
  question,
  containerClasses,
  showReadMore,
  showActionBtns = false,
}: Props) => {
  const hasVotedPromise = hasVoted({ targetType: "answer", targetId: _id });
  return (
    <article className={cn("light-border relative border-b py-10", containerClasses)}>
      <span
        id={`answer-${_id}`}
        className="hash-span"
      />
      {showActionBtns && (
        <div className="background-light800 flex-center absolute -top-5 -right-2 size-9 rounded-full">
          <EditDeleteAction
            type="Answer"
            itemId={_id}
          />
        </div>
      )}

      <div className="mb-5 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <div className="flex flex-1 items-start gap-1 sm:items-center">
          <UserAvatar
            id={author._id}
            name={author.name}
            imageUrl={author.image}
            className="size-5 rounded-full object-cover max-sm:mt-2"
          />

          <Link
            href={ROUTES.PROFILE(author._id)}
            className="flex flex-col max-sm:ml-1 sm:flex-row sm:items-center"
          >
            <p className="body-semibold text-dark300_light700">{author.name ?? "Anonymous"}</p>

            <p className="small-regular text-light400_light500 mt-0.5 ml-0.5 line-clamp-1">
              <span className="max-sm:hidden"> • </span>
              answered {getTimeStamp(createdAt)}
            </p>
          </Link>
        </div>

        <div className="flex justify-end">
          <Suspense fallback={<div>Loading...</div>}>
            <Votes
              upvotes={upvotes}
              downvotes={downvotes}
              targetType="answer"
              targetId={_id}
              hasVotedPromise={hasVotedPromise}
            />
          </Suspense>
        </div>
      </div>

      <Preview content={content} />

      {showReadMore && (
        <Link
          href={`/questions/${question}#answer-${_id}`}
          className="body-semibold font-space-grotesk text-primary-500 relative z-10"
        >
          <p className="mt-1">Read more...</p>
        </Link>
      )}
    </article>
  );
};
export default AnswerCard;
