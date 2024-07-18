import { Link } from "react-router-dom";
// import card_img from "../../assets/woods.jpg";
import { Post } from "../../pages/Home";

export const BlogCard = ({
  _id,
  title,
  body,
  thumbnail,
  postedBy,
  created,
  comments,
}: Post) => {
  const correctedUrl = `${import.meta.env.VITE_API_BASE}/${thumbnail.replace(
    /\\/g,
    "/"
  )}`;
  const maxLength = 200; // Số ký tự tối đa bạn muốn lấy
  const truncatedBody =
    body.length > maxLength ? body.substring(0, maxLength) + "..." : body;

  return (
    <div className=" bg-[#fff] shadow-lg shadow-slate-500 mb-10">
      <img src={correctedUrl} alt="img" className="w-full" />
      <div className="p-4 mt-2 flex flex-col gap-2">
        <h3 className="uppercase font-bold text-lg">{title}</h3>
        <div className="flex">
          <div className="mr-2">Author:</div>
          <div>{postedBy.name},</div>
          <div className="ml-2 text-slate-400">
            {new Date(created).toLocaleDateString()}
          </div>
        </div>
        <div dangerouslySetInnerHTML={{ __html: truncatedBody }}></div>
        <div className="flex justify-between">
          <div className="flex gap-2 items-center">
            <b className="text-sm">Comments:</b>{" "}
            <span className="rounded-lg bg-black p-1 text-center text-white text-sm">
              {comments}
            </span>
          </div>
          <Link
            to={"/posts/" + _id}
            className="bg-slate-500 text-white px-4 py-1 rounded-md cursor-pointer"
          >
            Read More &gt;
          </Link>
        </div>
      </div>
    </div>
  );
};
