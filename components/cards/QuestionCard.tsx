import EditDeleteAction from "@/components/user/EditDeleteAction";
import React from "react";
import { getTimeStamp } from "@/lib/utils";
import Link from "next/link";
import ROUTES from "@/constants/routes";
import TagCard from "@/components/cards/TagCard";
import Metric from "@/components/Metric";
import { IQuestion } from "@/types/global";

interface Props {
  question: IQuestion;
  showActionBtns?: boolean;
}

const QuestionCard = ({
  question: { _id, title, author, tags, upvotes, views, createdAt, answers },
  showActionBtns = false,
}: Props) => {
  return (
    <div className="card-wrapper rounded-2.5 p-9 sm:p-11">
      <div className="flex flex-col-reverse items-center justify-between gap-5 sm:flex-row">
        <div className="flex-1">
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimeStamp(createdAt)}
          </span>
          <Link href={ROUTES.QUESTION(_id)}>
            <h3 className="h3-semibold text-dark200_light900 line-clamp-1 flex-1">{title}</h3>
          </Link>
        </div>
        {showActionBtns && (
          <EditDeleteAction
            type="Question"
            itemId={_id}
          />
        )}
      </div>
      <div className="mt-3.5 flex w-full flex-wrap gap-2">
        {tags.map((tag) => (
          <TagCard
            key={tag._id}
            _id={tag._id}
            name={tag.name}
            compact
          />
        ))}
      </div>
      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={author.image}
          alt={author.name}
          value={author.name}
          title={`• asked ${getTimeStamp(createdAt)}`}
          href={ROUTES.PROFILE(author._id)}
          textStyles="body-medium text-dark400_light700"
          titleStyles="max-sm:hidden"
          isAuthor
        />
        <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
          <Metric
            imgUrl="/icons/like.svg"
            alt="Votes"
            value={upvotes}
            title=" Votes"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/icons/message.svg"
            alt="Answers"
            value={answers}
            title=" Answers"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/icons/eye.svg"
            alt="Views"
            value={views}
            title=" Views"
            textStyles="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </div>
  );
};
export default QuestionCard;
