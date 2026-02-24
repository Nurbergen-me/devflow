import React from "react";
import Link from "next/link";
import ROUTES from "@/constants/routes";
import { Badge } from "@/components/ui/badge";
import { getDeviconClassName } from "@/lib/utils";
import Image from "next/image";

interface Props {
  _id: string;
  name: string;
  questions?: number;
  showCount?: boolean;
  compact?: boolean;
  remove?: boolean;
  isButton?: boolean;
  handleRemove?: () => void;
}

const TagCard = ({
  _id,
  name,
  questions,
  showCount,
  compact,
  remove,
  isButton,
  handleRemove,
}: Props) => {
  const iconName = getDeviconClassName(name);

  const Content = (
    <>
      <Badge className="subtle-medium background-light800_dark300 text-light400_light500 flex flex-row gap-2 rounded-md border-none px-4 py-2 uppercase">
        <div className="flex-center space-x-2">
          <i className={`${iconName} text-sm`}></i>
          <span>{name}</span>
        </div>
        {remove && (
          <Image
            src="/icons/close.svg"
            alt="Remove"
            className="object-contai cursor-pointer invert-0 dark:invert"
            width={12}
            height={12}
            onClick={handleRemove}
          />
        )}
      </Badge>
      {showCount && <p className="small-medium text-dark500_light400">{questions}</p>}
    </>
  );

  if (compact) {
    if (isButton) {
      return (
        <button
          className="flex justify-between gap-2"
          onClick={() => {}}
        >
          {Content}
        </button>
      );
    } else {
      return (
        <Link
          href={ROUTES.TAGS(_id)}
          className="flex justify-between gap-2"
        >
          {Content}
        </Link>
      );
    }
  }
};
export default TagCard;
