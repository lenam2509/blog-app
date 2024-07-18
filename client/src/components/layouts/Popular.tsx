import { Link } from "react-router-dom";
import img from "../../assets/woods.jpg";
import http from "../../https/http";
import { useQuery } from "@tanstack/react-query";
import { Post } from "../../pages/Home";

export const Popular = () => {
  const getPopularPosts = async () => {
    const res = await http.get("/post/get-popular");
    return res.data;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["getPopularPosts"],
    queryFn: getPopularPosts,
  });

  return (
    <div className="bg-white shadow-lg shadow-gray-400 p-4 border-t-2 border-gray-300">
      <h3 className="text-lg">
        <b>Popular Posts</b>
      </h3>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error fetching data</p>}
      {data?.map((post: Post) => (
        <Link
          to={`/posts/${post._id}`}
          key={post._id}
          className="flex items-center mt-4 border-b-2 hover:bg-slate-300 cursor-pointer"
        >
          <img
            src={
              post.thumbnail
                ? `${import.meta.env.VITE_API_BASE}/${post.thumbnail.replace(/\\/g, "/")}`
                : img
            }
            alt="img"
            className="w-14 h-14"
          />
          <div className="ml-4">
            <h4>
              <b>{post.title}</b>
            </h4>
            <p className="text-sm ">{post.postedBy.name}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};
