import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Container, Logo, LogoutBtn } from "../index.js";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "../ThemeToggle.jsx";
import Profile from "../Profile.jsx";

export default function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  const dropdownRef = useRef(null);

  // Redirect after login
  useEffect(() => {
    if (authStatus) {
      navigate("/");
    }
  }, [authStatus, navigate]);

  // Click Outside Close Dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowLogout(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navItems = [
    { name: "Home", slug: "/", active: true },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/signup", active: !authStatus },
    { name: "My Posts", slug: "/my-posts", active: authStatus },
    { name: "Add Post", slug: "/add-post", active: authStatus },
  ];

  const toggleLogout = () => {
    setShowLogout((prev) => !prev);
  };

  const handleNavClick = (slug) => {
    navigate(slug);
    setShowLogout(false);   
    setMenuOpen(false);     
  };

  return (
    <header className="py-3 shadow bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
      <Container>
        <nav className="flex items-center justify-between">

          <Link to="/">
            <Logo width="100px" />
          </Link>

          <ul className="hidden md:flex items-center space-x-3">

            {navItems.map(
              (item) =>
                item.active && (
                  <li key={item.name}>
                    <button
                      onClick={() => handleNavClick(item.slug)}
                      className="px-4 py-2 rounded-full bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
                    >
                      {item.name}
                    </button>
                  </li>
                )
            )}

            {authStatus && (
              <li ref={dropdownRef} className="relative">
                <Profile toggle={toggleLogout} />

                {showLogout && (
                  <div className="absolute right-0 mt-2  bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-2">
                    <LogoutBtn />
                  </div>
                )}
              </li>
            )}

            <ThemeToggle />
          </ul>

          {/* Mobile Controls */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />

            <button
              className="text-2xl"
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
                      onClick={() => handleNavClick(item.slug)}
                      className="w-full text-left px-4 py-2 rounded bg-gray-300 dark:bg-gray-700"
                    >
                      {item.name}
                    </button>
                  </li>
                )
            )}

            {/* Mobile Profile */}
            {authStatus && (
              <li ref={dropdownRef}>
                <Profile toggle={toggleLogout} />

                {showLogout && (
                  <div className="mt-2 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-2">
                    <LogoutBtn />
                  </div>
                )}
              </li>
            )}

          </ul>
        )}
      </Container>
    </header>
  );
}
