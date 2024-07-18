import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import http from "../https/http";
import { useUserStore } from "../zustand/userStore";

const schema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(6, { message: "Password is too short" }),
});

type FormData = z.infer<typeof schema>;

export const Login = () => {
  const { setUser, setAuth } = useUserStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit((data) => {
    return http
      .post("/auth/login", data)
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: 'You have successfully logged in',
          });
          reset();
          localStorage.setItem("token", res.data.token);
          setUser(res.data.user);
          setAuth(true);
          navigate("/");
        }
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err.response.data.message,
        });
      });
  });

  return (
    <div className="flex flex-col justify-center items-center">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold">Login</h1>
        <input
          {...register("email")}
          type="email"
          placeholder="Email"
          className="p-2 border-2 border-slate-400 rounded-lg"
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        <input
          {...register("password")}
          type="password"
          placeholder="Password"
          className="p-2 border-2 border-slate-400 rounded-lg"
        />
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="p-2 bg-slate-500 disabled:bg-slate-400 text-white rounded-lg text-center"
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
            "Submit"
          )}
        </button>
      </form>
      <Link className="mt-4 text-blue-400" to={"/register"}>
        Dont have account? click here
      </Link>
      <Link className="mt-4 text-blue-400" to={"/forgetpassword"}>
        Forget password? click here
      </Link>
    </div>
  );
};
