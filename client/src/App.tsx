import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Home } from "./pages/Home";
import { Header } from "./components/layouts/Header";
import { Footer } from "./components/layouts/Footer";
import { DetailPosts } from "./pages/DetailPosts";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { ForgetPassword } from "./pages/ForgetPassword";
import { ManagePosts } from "./pages/ManagePosts";
import { CreatePost } from "./pages/CreatePost";
import { EditPost } from "./pages/EditPost";

function App() {
  return (
    <>
      <BrowserRouter>
        <div className="container m-auto lg:w-[1400px]">
          <Header />
          <main className="px-2 min-h-screen mt-10">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgetpassword" element={<ForgetPassword />} />
              <Route path="/manage-posts" element={<ManagePosts />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/edit-post/:id" element={<EditPost />} />
              <Route path="/posts/:id" element={<DetailPosts />} />
            </Routes>
          </main>
        </div>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
