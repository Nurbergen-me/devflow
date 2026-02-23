import React from "react";
import { getTimeStamp } from "@/lib/utils";
import Link from "next/link";
import ROUTES from "@/constants/routes";
import TagCard from "@/components/cards/TagCard";
import Metric from "@/components/Metric";

interface Props {
  question: Question;
}

const QuestionCard = ({
  question: { _id, title, author, tags, upvotes, views, createdAt, answers },
}: Props) => {
  return (
    <div className="card-wrapper rounded-2.5 p-9 sm:p-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimeStamp(createdAt)}
          </span>
          <Link href={ROUTES.QUESTION(_id)}>
            <h3 className="h3-semibold text-dark200_light900 line-clamp-1 flex-1">{title}</h3>
          </Link>
        </div>
      </div>
      <div className="mt-3.5 flex w-full flex-wrap gap-2">
        {tags.map((tag: Tag) => (
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
          textStyle="body-medium text-dark400_light700"
          isAuthor
        />
        <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
          <Metric
            imgUrl="/icons/like.svg"
            alt="Votes"
            value={upvotes}
            title=" Votes"
            textStyle="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/icons/message.svg"
            alt="Answers"
            value={answers}
            title=" Answers"
            textStyle="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/icons/eye.svg"
            alt="Views"
            value={views}
            title=" Views"
            textStyle="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </div>
  );
};
export default QuestionCard;
