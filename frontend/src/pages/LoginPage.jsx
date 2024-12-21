import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router";
import { loginUserApiRequest } from "../api/users.js";
import toast from "react-hot-toast";
import useAppStore from "../store.jsx";

const LoginPage = () => {
	const [formValues, setFormValues] = useState({
		username: "",
		password: "",
	});
	const [loginInProgress, setLoginInProgress] = useState(false);
	const location = useLocation();
	const { user ,setUser } = useAppStore();
	const queryParams = new URLSearchParams(location.search);
	const navigateTo = queryParams.get("to") || "/";

	const login = async () => {
		setLoginInProgress(true);
		let failed = false;
		const response = await loginUserApiRequest({
			username: formValues.username,
			password: formValues.password,
			onFail: (msg) => {
				toast.error("Login Failed: " + msg);
				failed = true;
			},
		});
		setLoginInProgress(false);
		if (!failed) {
			window.localStorage.setItem("token", response.data.token);
			setUser(response.data.user);	
			toast.success("Login Successful");
			return <Navigate to={navigateTo} />;
		}
	};
	if (user){
		return <Navigate to={navigateTo} />;
	}

	return (
		<div className="card bg-base-300 w-96 shadow-xl">
			<div className="card-body">
				<h2 className="card-title self-center">Login</h2>
				<h3 className="text-center text-xs text-gray-500">
					Please login to continue
				</h3>
				<div className="divider" />

				<label className="input input-bordered flex items-center gap-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 16 16"
						fill="currentColor"
						className="h-4 w-4 opacity-70"
					>
						<path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
					</svg>
					<input
						type="text"
						className="grow"
						onChange={() => {
							setFormValues({
								...formValues,
								username: event.target.value,
							});
						}}
						value={formValues.username}
						placeholder="Username"
					/>
				</label>

				<label className="input input-bordered flex items-center gap-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 16 16"
						fill="currentColor"
						className="h-4 w-4 opacity-70"
					>
						<path
							fillRule="evenodd"
							d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
							clipRule="evenodd"
						/>
					</svg>
					<input
						type="password"
						className="grow"
						onChange={() => {
							setFormValues({
								...formValues,
								password: event.target.value,
							});
						}}
						value={formValues.password}
						placeholder="Password"
					/>
				</label>

				<div className="card-actions mt-4 flex flex-col align-middle items-center justify-center">
					<button
						onClick={login}
						disabled={loginInProgress}
						className="btn btn-primary w-3/6"
					>
						{loginInProgress ? (
							<div className="flex flex-row flex-nowrap items-center justify-center text-primary">
								<span className="loading m-1 loading-spinner text-primary" />
								<p>Login...</p>
							</div>
						) : (
							"Login"
						)}
					</button>
					<Link className="btn" to="/register">
						Register
					</Link>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
