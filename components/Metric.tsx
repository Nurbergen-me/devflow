import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Props {
  imgUrl: string;
  alt: string;
  value: string | number;
  title: string;
  textStyles?: string;
  imageStyles?: string;
  href?: string;
  isAuthor?: boolean;
  titleStyles?: string;
}

const Metric = ({
  imgUrl,
  alt,
  value,
  title,
  textStyles,
  href,
  isAuthor,
  imageStyles,
  titleStyles,
}: Props) => {
  const metricContent = (
    <>
      <Image
        src={imgUrl}
        alt={alt}
        className={cn("rounded-full object-cover", imageStyles)}
        width={16}
        height={16}
      />
      <p className={cn("flex items-center gap-1", textStyles)}>
        {value}
        <span className={cn("small-regular line-clamp-1", titleStyles)}>{title}</span>
      </p>
    </>
  );
  return href ? (
    <Link
      href={href}
      className="flex-center gap-1"
    >
      {metricContent}
    </Link>
  ) : (
    <div className="flex-center gap-1">{metricContent}</div>
  );
};
export default Metric;
