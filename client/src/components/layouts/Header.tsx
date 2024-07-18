import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="p-8 text-center">
      <Link to={"/"} className="text-3xl my-4">
        <b>PEOPLE BLOG</b>
      </Link>
      <p className="text-sm">A blog for the people, by the people</p>
    </header>
  );
};
