// components/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Settings, Heart, LogOut, Menu, X } from "lucide-react";

export default function Navbar() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isUserOpen, setIsUserOpen] = useState(false);
	const userRef = useRef(null);

	// Sprawdza czy użytkownij jest zalogowany(istnieje jwt)
	const isLogged = document.cookie.includes("jwt=");

	// Zamknij dropdown użytkownika, gdy klikniesz poza nim
	useEffect(() => {
		function handleClickOutside(e) {
			if (userRef.current && !userRef.current.contains(e.target)) {
				setIsUserOpen(false);
			}
		}
		document.addEventListener("click", handleClickOutside);
		return () => document.removeEventListener("click", handleClickOutside);
	}, []);

	return (
		<nav className="relative bg-[var(--color-ivorylight)] shadow h-16 flex items-center justify-between px-6 md:px-12">
			{/* Logo */}
			<Link
				//wyświetla w zależności od logowania page
				to={isLogged ? "/offers" : "/"}
				className="flex items-center space-x-3"
			>
				<div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[var(--color-kraft)] to-[var(--color-manilla)] flex items-center justify-center">
					<span className="text-[var(--color-basewhite)] font-bold text-lg">
						C
					</span>
				</div>
				<span className="text-2xl font-bold text-[var(--color-slatedark)]">
					CeVeMe
				</span>
			</Link>

			{/* Desktop: główne linki */}
			<div className="hidden md:flex items-center space-x-8">
				<Link
					to="/cv"
					className="font-semibold hover:text-[var(--color-slatedark)]"
				>
					CV
				</Link>
				<Link
					to="/demo"
					className="font-semibold hover:text-[var(--color-slatedark)]"
				>
					Demo
				</Link>
				<Link
					to="/contact"
					className="font-semibold hover:text-[var(--color-slatedark)]"
				>
					Contact
				</Link>
			</div>

			{/* Desktop: dropdown Użytkownik */}
			<div className="hidden md:flex items-center space-x-4" ref={userRef}>
				<button
					onClick={() => setIsUserOpen((open) => !open)}
					className="flex items-center space-x-2 text-[var(--color-slatedark)] hover:text-[var(--color-kraft)] transition-colors duration-200"
				>
					<div className="w-8 h-8 rounded-full bg-gradient-to-r from-[var(--color-kraft)] to-[var(--color-manilla)] flex items-center justify-center">
						<span className="text-[var(--color-basewhite)] font-bold text-sm">
							U
						</span>
					</div>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className={`h-4 w-4 transition-transform duration-200 ${
							isUserOpen ? "rotate-180" : ""
						}`}
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M19 9l-7 7-7-7"
						/>
					</svg>
				</button>

				{isUserOpen && (
					<div className="absolute right-12 top-full mt-2 w-48 bg-[var(--color-basewhite)] rounded-lg shadow-lg border border-gray-200 py-2">
						<Link
							to="/settings"
							onClick={() => setIsUserOpen(false)}
							className="flex items-center px-4 py-2 hover:bg-gray-50 transition-colors duration-200"
						>
							<Settings className="h-5 w-5 mr-3" /> Ustawienia
						</Link>
						<Link
							to="/favorites"
							onClick={() => setIsUserOpen(false)}
							className="flex items-center px-4 py-2 hover:bg-gray-50 transition-colors duration-200"
						>
							<Heart className="h-5 w-5 mr-3" /> Ulubione
						</Link>
						<hr className="my-2 border-gray-200" />
						<button
							onClick={() => {
								setIsUserOpen(false);
								console.log("Wylogowywanie...");
							}}
							className="flex items-center w-full px-4 py-2 text-[var(--color-kraft)] hover:bg-red-50 transition-colors duration-200"
						>
							<LogOut className="h-5 w-5 mr-3" /> Wyloguj
						</button>
					</div>
				)}
			</div>

			{/* Mobile: hamburger */}
			<div className="md:hidden">
				<button
					onClick={() => setIsMenuOpen((open) => !open)}
					className="p-2 rounded-md hover:bg-gray-200 transition"
				>
					{isMenuOpen ? (
						<X className="h-6 w-6 text-[var(--color-slatedark)]" />
					) : (
						<Menu className="h-6 w-6 text-[var(--color-slatedark)]" />
					)}
				</button>
			</div>

			{/* Mobile: rozbudowane menu */}
			{isMenuOpen && (
				<div className="absolute right-6 top-full mt-2 bg-[var(--color-ivorylight)] shadow-lg rounded-md w-48 py-2 z-10">
					<Link
						to="/cv"
						onClick={() => setIsMenuOpen(false)}
						className="block px-4 py-2 hover:bg-gray-100"
					>
						CV
					</Link>
					<Link
						to="/demo"
						onClick={() => setIsMenuOpen(false)}
						className="block px-4 py-2 hover:bg-gray-100"
					>
						Demo
					</Link>
					<Link
						to="/contact"
						onClick={() => setIsMenuOpen(false)}
						className="block px-4 py-2 hover:bg-gray-100"
					>
						Contact
					</Link>
					<hr className="my-2 border-gray-200" />
					<Link
						to="/settings"
						onClick={() => setIsMenuOpen(false)}
						className="block px-4 py-2 hover:bg-gray-100"
					>
						Ustawienia
					</Link>
					<Link
						to="/favorites"
						onClick={() => setIsMenuOpen(false)}
						className="block px-4 py-2 hover:bg-gray-100"
					>
						Ulubione
					</Link>
					<button
						onClick={() => {
							setIsMenuOpen(false);
							console.log("Wylogowywanie...");
						}}
						className="w-full text-left px-4 py-2 hover:bg-red-50 text-[var(--color-kraft)]"
					>
						Wyloguj
					</button>
				</div>
			)}
		</nav>
	);
}
