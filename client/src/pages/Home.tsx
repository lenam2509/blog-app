import { useState } from "react";
import { AuthSection } from "../components/layouts/AuthSection";
import { BlogCard } from "../components/layouts/blogCard";
import { Popular } from "../components/layouts/Popular";
import { Tags } from "../components/layouts/Tags";
import http from "../https/http";
import { useQuery } from "@tanstack/react-query";

export type Post = {
  _id: string;
  title: string;
  body: string;
  thumbnail: string;
  postedBy: {
    name: string;
  };
  created: string;
  comments: number;
};

export const Home = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const fetchPosts = async (page: number) => {
    const res = await http.get(`/post/get-all?page=${page}`);
    return res.data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["posts", currentPage],
    queryFn: () => fetchPosts(currentPage),
    refetchOnWindowFocus: false,
  });

  const handeNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage <= 1) return;
    setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="flex flex-col  md:flex md:flex-row gap-4 w-full">
      <div className="md:w-[60%] w-full">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          data.posts.map((post: Post) => <BlogCard key={post._id} {...post} />)
        )}
        {/* pagination buttons */}
        <div className="flex gap-4">
          <button
            disabled={currentPage === 1}
            onClick={handlePrevPage}
            className="p-2 rounded bg-gray-500 text-white disabled:bg-slate-400"
          >
            &lt; Previous
          </button>
          <button
            disabled={
              currentPage * 2 >= data?.total || data?.posts.length === 0
            }
            onClick={handeNextPage}
            className="p-2 rounded bg-gray-500 text-white disabled:opacity-50"
          >
            Next &gt;
          </button>
        </div>
      </div>

      <div className=" md:w-[40%] w-full flex flex-col gap-8">
        <AuthSection />
        <Popular />
        <Tags />
      </div>
    </div>
  );
};
