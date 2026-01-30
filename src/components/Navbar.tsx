"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiMenu, FiX } from "react-icons/fi";
import { usePathname } from "next/navigation";
import styles from "@/styles/navbar.module.css";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Auth states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userType, setUserType] = useState<string | null>(null);

  const links = [
    { name: "Case Studies / Solutions", href: "" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms & Conditions", href: "/terms" },
  ];

  const dashboardPath =
    userType === "photographer" ? "/dashboard/photographer" : "/dashboard/user";

  // Fetch auth info on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/authcookies");
        const data = await res.json();
        setIsLoggedIn(data.isLoggedIn);
        if (data.isLoggedIn && data.user) {
          setUserName(data.user.name || null);
          setUserType(data.user.userType || null);
        }
      } catch {
        setIsLoggedIn(false);
        setUserName(null);
      }
    }
    checkAuth();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setIsLoggedIn(false);
      setUserName(null);
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <header className={styles.header}>
      <nav
        className={`${styles.navbar} max-w-7xl mx-auto px-6 py-4 flex items-center justify-between`}
      >
        {/* Left Section: Logo + Nav Links */}
        <div className="flex items-center space-x-10">
          {/* Logo */}
          <Link href="/" className={styles.logoWrapper}>
            <Image
              src="/logo.svg"
              alt="Klickshare Logo"
              width={80}
              height={70}
              className={styles.logoImage}
            />
          </Link>

          {/* Desktop Nav Links */}
          <div className={`${styles.navLinks} hidden md:flex`}>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.navLink} ${
                  pathname === link.href ? styles.activeLink : ""
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Right Section */}
        <div className={`${styles.authSection} relative`} ref={dropdownRef}>
          {/* Try Now / Profile Dropdown */}
          {isLoggedIn ? (
            <>
              <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className={styles.tryNow}
              >
                Hi, {userName}
              </button>
              {isDropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <Link
                    href={dashboardPath}
                    className={styles.dropdownItem}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    My Profile
                  </Link>
                  <button onClick={handleLogout} className={styles.dropdownItem}>
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className={styles.tryNow}
              >
                <img src="/try-now.svg" alt="icon" className={styles.icon} />
                Try Now
              </button>
              {isDropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <Link
                    href="/login"
                    className={styles.dropdownItem}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className={styles.dropdownItem}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className={`${styles.menuToggle} md:hidden ml-4`}
            onClick={() => setMenuOpen(true)}
          >
            <FiMenu size={26} />
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar Menu */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.active : ""}`}>
        <button className={styles.closeButton} onClick={() => setMenuOpen(false)}>
          <FiX size={26} />
        </button>

        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={styles.mobileLink}
            onClick={() => setMenuOpen(false)}
          >
            {link.name}
          </Link>
        ))}

        {/* Try Now / Profile for mobile */}
        <div className="mt-4">
          {isLoggedIn ? (
            <>
              <Link href={dashboardPath} className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
                My Profile
              </Link>
              <button onClick={handleLogout} className={styles.mobileLink}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link href="/signup" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Background Overlay */}
      {menuOpen && <div className={styles.overlay} onClick={() => setMenuOpen(false)}></div>}
    </header>
  );
}