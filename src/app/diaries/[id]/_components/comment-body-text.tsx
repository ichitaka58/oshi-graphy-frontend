"use client";

import { useState } from "react";

const CommentBodyText = ({ text }: { text: string }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const MAX_LENGTH = 60;
  if (text.length <= MAX_LENGTH) {
    return <p className="text-muted-foreground">{text}</p>;
  }
  return (
    <div>
      <p className="text-muted-foreground">
        {isExpanded ? text : `${text.slice(0, MAX_LENGTH)}...`}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-2 underline"
        >
          {isExpanded ? "折りたたむ" : "もっと見る"}
        </button>
      </p>

    </div>
  );
};

export default CommentBodyText;
