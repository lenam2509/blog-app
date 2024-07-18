import { Link } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUserStore } from "../zustand/userStore";
import http from "../https/http";
import Swal from "sweetalert2";
import { useState } from "react";

// Định nghĩa schema zod
const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  body: z.string().min(1, { message: "Body is required" }),
  tag: z.string(),
  thumbnail: z
    .any()
    .refine((file) => file?.length === 1, { message: "Photo is required" })
    .refine((file) => file && file[0]?.size <= 5000000, {
      message: "Max file size is 5MB",
    }),
});

type FormData = z.infer<typeof schema>;

export const CreatePost = () => {
  const { user } = useUserStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [thumbnail, setThumbnail] = useState<File | null>(null);

  // console.log(errors.body);

  const onSubmit = handleSubmit((data) => {
    const formData = new FormData();
    formData.append("thumbnail", data.thumbnail[0]);
    formData.append("title", data.title);
    formData.append("body", data.body);
    formData.append("tag", data.tag);
    formData.append("postedBy", user?.id || "");

    formData.forEach((value, key) => {
      console.log(key, value);
    });

    return http
      .post("/post/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          Swal.fire({
            title: "Success",
            text: res.data.message,
            icon: "success",
          });
          reset();
      }
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          title: "Error",
          text: "Something went wrong",
          icon: "error",
        });
      });
  });

  return (
    <div>
      <Link to="/manage-posts" className="text-blue-400">
        {" "}
        &lt; Return back
      </Link>
      <h1 className="text-2xl text-center font-bold my-4">Create Post</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <input
          {...register("title")}
          type="text"
          placeholder="Title"
          className="p-2 border border-gray-400 rounded-lg"
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}

        <select
          {...register("tag")}
          className="p-2 border border-gray-400 rounded-lg"
          name="tag"
          id="tag"
        >
          <option value="">Select a tag</option>
          <option value="react">React</option>
          <option value="node">Node</option>
          <option value="express">Express</option>
          <option value="mongodb">MongoDB</option>
          <option value="javascript">JavaScript</option>
        </select>

        <div className="p-2 border border-gray-400 rounded-lg">
          <Controller
            name="body"
            control={control}
            render={({ field: { onChange } }) => (
              <Editor
                // {...field}
                apiKey="j46mbdvornqc94gylmcgy563go40cnbonv3mt4rd7rmyeuwx"
                initialValue="Write your content here..."
                onEditorChange={onChange}
              />
            )}
          />
        </div>
        {errors.body && <p className="text-red-500">{errors.body.message}</p>}
        <input
          {...register("thumbnail")}
          type="file"
          id="image"
          className="p-2 border border-gray-400 rounded-lg"
          onChange={(e) => {
            if (e.target.files) {
              setThumbnail(e.target.files[0]);
            }
          }}
        />
        {errors.thumbnail && (
          <p className="text-red-500">{errors.thumbnail.message?.toString()}</p>
        )}
        <img
          src={
            thumbnail
              ? URL.createObjectURL(thumbnail)
              : "https://via.placeholder.com/150"
          }
          alt=""
          className="w-1/4"
        />
        <button
          disabled={isSubmitting}
          className="p-2 bg-blue-500 text-white text-center rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
            "Create Post"
          )}
        </button>
      </form>
    </div>
  );
};
