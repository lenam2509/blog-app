import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserStore } from "../../zustand/userStore";
import { useParams } from "react-router-dom";
import http from "../../https/http";
import { useQuery } from "@tanstack/react-query";

const schema = z.object({
  comment: z.string().min(1, "Comment is required"),
});

type CommentForm = z.infer<typeof schema>;

type Comment = {
  _id: string;
  userId: {
    name: string;
    id: string;
  };
  comment: string;
  created: string;
};

export const CommentSection = ({
  refetchPost,
}: {
  refetchPost: () => void;
}) => {
  const { user, isAuth } = useUserStore();
  const postID = useParams<{ id: string }>().id;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CommentForm>({
    resolver: zodResolver(schema),
  });

  const getComments = async () => {
    const res = await http.get(`/comment/get-comments?postId=${postID}`);
    return res.data;
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["comments", postID],
    queryFn: getComments,
    refetchOnWindowFocus: false,
  });

  const onSubmit = handleSubmit((data) => {
    const payload = {
      userId: user?.id,
      comment: data.comment,
      postId: postID,
    };
    return http
      .post("/comment/create-comment", payload)
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          console.log("Comment created successfully");
          reset();
          refetch();
          refetchPost();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });

  return (
    <div>
      <form onSubmit={onSubmit} className="flex flex-col gap-2">
        <textarea
          {...register("comment")}
          name="comment"
          id="comment"
          cols={20}
          rows={2}
          className="md:w-[50%] p-2 rounded-lg border-2 border-slate-400"
          placeholder="Write your comment here..."
        ></textarea>
        {errors.comment && (
          <div className="text-red-500 text-sm">{errors.comment.message}</div>
        )}
        {!isAuth && (
          <div className="text-red-500 text-sm">
            You need to be logged in to comment
          </div>
        )}
        <button
          disabled={isSubmitting || !isAuth}
          type="submit"
          className="p-2 bg-blue-500 rounded text-white w-fit disabled:opacity-50"
        >
          {isSubmitting ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 animate-spin"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          ) : (
            "Comment"
          )}
        </button>
      </form>

      {isLoading && <div>Loading...</div>}
      {isError && <div>Something went wrong...</div>}
      {data?.comments.length === 0 && <div>No comments yet</div>}
      {data?.comments.map((comment: Comment) => (
        <div key={comment._id} className="flex flex-col gap-2 mt-4 ">
          <div className="flex gap-2 items-center">
            <div className="text-lg">{comment.userId.name}:</div>
            <div className="text-slate-400">
              {new Date(comment.created).toLocaleDateString()}
            </div>
          </div>
          <div className="md:w-[50%] md:text-sm border-b-2 border-gray-400">
            {comment.comment}
          </div>
        </div>
      ))}
    </div>
  );
};
