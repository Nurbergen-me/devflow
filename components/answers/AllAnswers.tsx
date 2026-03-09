import AnswerCard from "@/components/cards/AnswerCard";
import DataRenderer from "@/components/DataRenderer";
import CommonFilter from "@/components/filters/CommonFilter";
import Pagination from "@/components/Pagination";
import { AnswerFilters } from "@/constants/filters";
import { EMPTY_ANSWERS } from "@/constants/states";
import { ActionResponse, IAnswer } from "@/types/global";
import React from "react";

interface Props extends ActionResponse<IAnswer[]> {
  totalAnswers: number;
  page: number;
  isNext: boolean;
}
const AllAnswers = ({ data, success, error, totalAnswers, page, isNext }: Props) => {
  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">
          {totalAnswers} {totalAnswers === 1 ? "Answer" : "Answers"}
        </h3>
        <CommonFilter
          filters={AnswerFilters}
          otherClasses="sm:min-w-32"
          containerClasses="max-xs:w-full"
        />
      </div>
      <DataRenderer
        success={success}
        data={data}
        error={error}
        empty={EMPTY_ANSWERS}
        render={(answers) =>
          answers.map((answer) => (
            <AnswerCard
              key={answer._id}
              {...answer}
            />
          ))
        }
      />

      <Pagination
        page={page}
        isNext={isNext || false}
      />
    </div>
  );
};
export default AllAnswers;
