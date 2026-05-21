import { Comment } from "@/types/comment";
import { Diary } from "@/types/diary";
import { cookies } from "next/headers";

const DiaryDetail = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const token = (await cookies()).get("token")?.value;
  const res = await fetch(`${process.env.LARAVEL_API_URL}/api/diaries/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  const data = await res.json();
  const diary: Diary = data.diary;
  const comments: Comment[] = data.comments;
  console.log(comments);

  return (
    <div>
      <section>
        <div>{diary.artist.name}</div>
        <div>{diary.happened_on}</div>
        <div>{diary.is_public ? "公開" : "非公開"}</div>
        <div>{diary.body}</div>
        <div>更新日時: {diary.updated_at}</div>
        <div>{diary.likes_count}</div>
      </section>
      <section>
        {comments.length === 0 ? (
          <p>まだコメントはありません</p>
        ) : (
          comments.map((comment) => {
            const hasReply: boolean = comment.depth > 0;
            return (
              <div key={comment.id}>
                <div>{comment.user.name}</div>
                <div>{comment.created_at}</div>
                <div>{comment.likes_count}</div>
                <div>{comment.likes_count}</div>
                <div>{comment.body}</div>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
};

export default DiaryDetail;
