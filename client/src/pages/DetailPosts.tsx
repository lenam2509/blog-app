import { Link, useParams } from "react-router-dom";
import { CommentSection } from "../components/layouts/CommentSection";
import { useQuery } from "@tanstack/react-query";
import http from "../https/http";
import { Post } from "./Home";

export const DetailPosts = () => {
  const { id } = useParams<{ id: string }>();
  const getPost = async () => {
    const res = await http.get<Post>(`/post/get-one?id=${id}`);
    return res.data;
  };
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["post", id],
    queryFn: getPost,
    refetchOnWindowFocus: false,
  });
  const correctedUrl = `${
    import.meta.env.VITE_API_BASE
  }/${data?.thumbnail.replace(/\\/g, "/")}`;

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;
  return (
    <div className="bg-white min-h-[500px]">
      <div className="p-4 flex flex-col gap-4">
        <Link to="/" className="text-slate-500 text-sm w-fit">
          &lt; Back to Home
        </Link>
        <img src={correctedUrl} alt="" className="w-full" />
        <h3 className="text-xl font-bold">{data?.title}</h3>
        <div className="flex gap-2 items-center">
          <div>Author:</div>
          <div>{data?.postedBy.name},</div>
          <div className="text-slate-400">
            {data?.created && new Date(data.created).toLocaleDateString()}
          </div>
        </div>
        <div dangerouslySetInnerHTML={{ __html: data?.body || "" }}></div>
        <div className="flex gap-2 items-center">
          <b>Comments:</b>
          <span className="rounded-lg bg-black p-1 text-center text-white text-sm">
            {data?.comments}
          </span>
        </div>
        <CommentSection refetchPost={refetch} />
      </div>
    </div>
  );
};
