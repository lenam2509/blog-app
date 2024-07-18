import { Link } from "react-router-dom";

export const ForgetPassword = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <form className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold">Forget Password</h1>
        <label htmlFor="email">Enter email to reset the password</label>
        <input
          type="email"
          id="email"
          placeholder="Email"
          className="p-2 border-2 border-slate-400 rounded-lg"
        />
        <button className="p-2 bg-slate-500 disabled:text-slate-400 text-white rounded-lg">
          send
        </button>
      </form>
      <Link className="mt-4 text-blue-400" to={"/login"}>
        &lt;Return to login
      </Link>
    </div>
  );
};
