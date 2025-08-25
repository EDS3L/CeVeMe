import React, { useState } from "react";
import UseAuth from "../hooks/UseAuth";
import { useNavigate } from "react-router-dom";

const LockIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="h-5 w-5 text-cloudmedium"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
		/>
	</svg>
);

const LoginForm = () => {
	const hasError = false;
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const useAuth = new UseAuth();
	const navigate = useNavigate();

	const handleSignIn = async (e) => {
		e.preventDefault();
		await useAuth.login(email, password, navigate);
	};

	return (
		<div className="bg-manilla min-h-screen flex items-center justify-center font-sans p-4">
			<div className="w-full max-w-md bg-slatelight rounded-lg shadow-lg p-8 space-y-6">
				<div className="text-center">
					<h1 className="text-3xl font-bold text-ivorylight">Witaj ponownie</h1>
					<p className="text-cloudmedium mt-2">Zaloguj się, aby kontynuować.</p>
				</div>

				<form className="space-y-6" onSubmit={handleSignIn}>
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-ivorymedium mb-2"
						>
							Adres Email
						</label>
						<input
							type="email"
							id="email"
							name="email"
							onChange={(e) => setEmail(e.target.value)}
							placeholder="ty@przyklad.com"
							className={`w-full px-4 py-3 bg-slatelight border ${
								hasError ? "border-feedbackerror" : "border-clouddark"
							} rounded-md text-ivorylight placeholder-cloudmedium focus:outline-none focus:ring-2 focus:ring-feedbackfocus focus:border-transparent transition duration-200`}
						/>
					</div>

					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-ivorymedium mb-2"
						>
							Hasło
						</label>
						<div className="relative">
							<input
								type="password"
								id="password"
								name="password"
								placeholder="••••••••"
								onChange={(e) => setPassword(e.target.value)}
								className="w-full pl-4 pr-10 py-3 bg-slatelight border border-clouddark rounded-md text-ivorylight placeholder-cloudmedium focus:outline-none focus:ring-2 focus:ring-feedbackfocus focus:border-transparent transition duration-200"
							/>
							<div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
								<LockIcon />
							</div>
						</div>
						{hasError && (
							<p className="text-sm text-feedbackerror mt-2">
								Nieprawidłowy email lub hasło.
							</p>
						)}
					</div>

					<div className="flex items-center justify-between">
						<a
							href="#"
							className="text-sm text-kraft hover:underline focus:outline-none focus:ring-1 focus:ring-kraft rounded"
						>
							Nie pamiętasz hasła?
						</a>
					</div>

					<div>
						<button
							type="submit"
							className="w-full bg-bookcloth text-ivorylight font-bold py-3 px-4 rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slatemedium focus:ring-bookcloth transition duration-200"
						>
							Zaloguj się
						</button>
					</div>
				</form>

				<div className="text-center">
					<p className="text-sm text-cloudmedium">
						Nie masz jeszcze konta?{" "}
						<a
							href="/auth/register"
							className="font-medium text-kraft hover:underline focus:outline-none focus:ring-1 focus:ring-kraft rounded"
						>
							Zarejestruj się
						</a>
					</p>
				</div>
			</div>
		</div>
	);
};

export default LoginForm;
