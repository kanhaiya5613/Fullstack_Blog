import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Container, Logo, LogoutBtn } from "../index.js";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "../ThemeToggle.jsx";

export default function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (authStatus) {
      navigate("/all-posts");
    }
  }, [authStatus]);

  const navItems = [
    { name: "Home", slug: "/", active: true },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/signup", active: !authStatus },
    { name: "All Posts", slug: "/all-posts", active: authStatus },
    { name: "Add Post", slug: "/add-post", active: authStatus },
  ];

  return (
    <header className="py-3 shadow bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
      <Container>
        <nav className="flex items-center justify-between">

          {/* Logo */}
          <Link to="/">
            <Logo width="100px" />
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center space-x-2">
            {navItems.map(
              (item) =>
                item.active && (
                  <li key={item.name}>
                    <button
                      onClick={() => navigate(item.slug)}
                      className="px-4 py-2 rounded-full bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
                    >
                      {item.name}
                    </button>
                  </li>
                )
            )}

            {authStatus && <LogoutBtn />}

            <ThemeToggle />
          </ul>

          {/* Mobile Hamburger */}
          <div className="md:hidden text-2xl">
            <ThemeToggle />
            <button
              className="md:hidden text-2xl"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>
            </div>
        </nav>

        {/* Mobile Menu */}
        {menuOpen && (
          <ul className="md:hidden mt-4 space-y-2">

            {navItems.map(
              (item) =>
                item.active && (
                  <li key={item.name}>
                    <button
                      onClick={() => {
                        navigate(item.slug);
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 rounded bg-gray-300 dark:bg-gray-700"
                    >
                      {item.name}
                    </button>
                  </li>
                )
            )}

            {authStatus && <LogoutBtn />}


          </ul>
        )}

      </Container>
    </header>
  );
}
