import { Link } from "react-router-dom";
import http from "../https/http";
import { useUserStore } from "../zustand/userStore";
import { useQuery } from "@tanstack/react-query";
import { Post } from "./Home";
import { useState } from "react";
import Swal from "sweetalert2";

export const ManagePosts = () => {
  const { user } = useUserStore();
  const [page, setPage] = useState(1);
  const getPostsByUser = async () => {
    const res = await http.get(`/post/get-by-user?id=${user?.id}&page=${page}`);
    return res.data;
  };
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["posts", user?.id, page],
    queryFn: getPostsByUser,
    refetchOnWindowFocus: false,
  });
  const handleNext = () => {
    setPage(page + 1);
  };
  const handlePrev = () => {
    if (page === 1) return;
    setPage(page - 1);
  };

  const handleDelete = async (id: string) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await http.delete(`/post/delete?id=${id}`);
          Swal.fire("Deleted!", "Your post has been deleted.", "success");
          refetch();
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="flex justify-between">
        <Link to="/" className="text-blue-400">
          {" "}
          &lt; Return back
        </Link>
        <Link to="/create-post" className="text-blue-400">
          {" "}
          Create a new post &gt;
        </Link>
      </div>
      <h1 className="text-2xl text-center font-bold my-4">Manage Posts</h1>
      <div className="flex flex-col gap-4">
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error fetching data</p>}
        {data?.posts.length === 0 && <p>No posts found</p>}
        {data?.posts.map((post: Post) => (
          <div
            key={post._id}
            className="flex justify-between items-center bg-gray-200 p-4 rounded-lg"
          >
            <h2 className="text-lg font-bold">{post.title}</h2>
            <div className="flex gap-4">
              <Link
                to={"/edit-post/" + post._id}
                className="p-2 bg-blue-500 text-white rounded-lg"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(post._id)}
                className="p-2 bg-red-500 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        <div className="flex gap-4 justify-center">
          <button
            onClick={handlePrev}
            disabled={page === 1}
            className="p-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed "
          >
            &lt; PREV
          </button>
          <button
            disabled={page * 5 >= data?.total || data?.posts.length === 0}
            onClick={handleNext}
            className="p-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed "
          >
            NEXT &gt;
          </button>
        </div>
      </div>
    </div>
  );
};
