import { Editor } from "@tinymce/tinymce-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import http from "../https/http";
import { useQuery } from "@tanstack/react-query";
import { Post } from "./Home";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";

const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  body: z.string().min(1, { message: "Body is required" }),
  thumbnail: z.any().optional(),
});

type FormData = z.infer<typeof schema>;

export const EditPost = () => {
  const { id } = useParams<{ id: string }>();
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const getPost = async () => {
    const res = await http.get<Post>(`/post/get-one?id=${id}`);
    return res.data;
  };
  const { data, isLoading, isError } = useQuery({
    queryKey: ["post", id],
    queryFn: getPost,
    refetchOnWindowFocus: false,
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<FormData>({
    values: {
      title: data?.title || "",
      body: data?.body || "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit((data) => {
    const formData = new FormData();
    formData.append("thumbnail", thumbnail || data.thumbnail);
    formData.append("title", data.title);
    formData.append("body", data.body);
    return http
      .put(`/post/update?id=${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          Swal.fire("Success", res.data.message, "success");
        }
      })
      .catch((err) => {
        console.log(err);
        Swal.fire("Error", "Something wrong", "error");
      });
  });
  const correctedUrl = `${
    import.meta.env.VITE_API_BASE
  }/${data?.thumbnail.replace(/\\/g, "/")}`;

  return (
    <div>
      <Link to="/manage-posts" className="text-blue-400">
        {" "}
        &lt; Return back
      </Link>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error</p>}
      <h1 className="text-2xl text-center font-bold my-4">Edit Post</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Controller
          name="title"
          control={control}
          defaultValue={data?.title}
          render={({ field }) => (
            <input
              {...register("title")}
              type="text"
              placeholder="Title"
              className="p-2 border border-gray-400 rounded-lg"
              {...field}
            />
          )}
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
        <div className="p-2 border border-gray-400 rounded-lg">
          <Controller
            name="body"
            control={control}
            defaultValue={data?.body}
            render={({ field: { onChange } }) => (
              <Editor
                // {...field}
                apiKey="j46mbdvornqc94gylmcgy563go40cnbonv3mt4rd7rmyeuwx"
                initialValue={data?.body}
                onEditorChange={onChange}
              />
            )}
          />
          {errors.body && <p className="text-red-500">{errors.body.message}</p>}
        </div>

        <Controller
          name="thumbnail"
          control={control}
          defaultValue={data?.thumbnail}
          render={({ field: { onChange } }) => (
            <input
              {...register("thumbnail")}
              type="file"
              id="image"
              className="p-2 border border-gray-400 rounded-lg"
              onChange={(e) => {
                onChange(e.target.files);
                setThumbnail(e.target.files?.[0] || null);
              }}
            />
          )}
        />
        {errors.thumbnail && (
          <p className="text-red-500">{errors.thumbnail.message?.toString()}</p>
        )}
        <img
          src={thumbnail ? URL.createObjectURL(thumbnail) : correctedUrl}
          alt={data?.title}
          className="w-1/4"
        />
        <button
          disabled={isSubmitting}
          className="p-2 bg-blue-500 text-white rounded-lg"
        >
          {isSubmitting ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 animate-spin mx-auto"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          ) : (
            "Save"
          )}
        </button>
      </form>
    </div>
  );
};
