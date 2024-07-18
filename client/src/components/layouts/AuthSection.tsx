import { Link } from "react-router-dom";
import user_img from "../../assets/user.jpg";
import { useUserStore } from "../../zustand/userStore";
import Swal from "sweetalert2";

export const AuthSection = () => {
  const { isAuth, user, logout } = useUserStore();

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    Swal.fire({
      icon: "success",
      title: "Success",
      text: "You have successfully logged out",
    });
  };

  return (
    <div className="bg-white shadow-lg shadow-gray-400 min-h-[200px] flex flex-col items-center justify-center border rounded border-gray-400">
      <img src={user_img} alt="img" width={100} />
      <div className="flex">
        {isAuth ? (
          <div className="flex flex-col gap-4 ">
            <h1 className="text-2xl font-bold">{user?.name}</h1>
            <Link
              to={"/manage-posts"}
              className="p-2 bg-slate-500 text-center text-white rounded-lg"
            >
              Manage Posts
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-400 text-center rounded-lg p-1 my-4 text-white"
            >
              Logout🚪
            </button>
          </div>
        ) : (
          <Link to="/login" className="text-blue-500">
            Login to create a posts
          </Link>
        )}
      </div>
    </div>
  );
};
