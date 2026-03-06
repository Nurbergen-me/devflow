import AnswerCard from "@/components/cards/AnswerCard";
import DataRenderer from "@/components/DataRenderer";
import { EMPTY_ANSWERS } from "@/constants/states";
import { ActionResponse, IAnswer } from "@/types/global";
import React from "react";

interface Props extends ActionResponse<IAnswer[]> {
  totalAnswers: number;
}
const AllAnswers = ({ data, success, error, totalAnswers }: Props) => {
  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">
          {totalAnswers} {totalAnswers === 1 ? "Answer" : "Answers"}
        </h3>
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
    </div>
  );
};
export default AllAnswers;
