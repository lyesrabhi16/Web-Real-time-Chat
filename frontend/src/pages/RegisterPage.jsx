import { useState } from "react";
import { Link, Navigate } from "react-router";
import { registerUserApiRequest, userExistsApiRequest } from "../api/users.js";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import useAppStore from "../store.jsx";
const RegisterPage = () => {
	const [formValues, setFormValues] = useState({
		username: "",
		password: "",
		password2: "",
	});
	const [errorPassword, setErrorPassword] = useState(null);
	const [errorPassword2, setErrorPassword2] = useState(null);
	const [errorPasswordsDontMatch, setErrorPasswordsDontMatch] = useState(null);
	const [errorUsername, setErrorUsername] = useState(null);

	const [disableRegisterButton, setDisableRegisterButton] = useState(true);
	const [ForceDisableRegisterButton, setForceDisableRegisterButton] =
		useState(false);
	const [Loading, setLoading] = useState(false);

	const userExistsRequest = async () => {
		const response = await userExistsApiRequest({
			username: formValues.username,
		});
		console.log(response.data);

		return response.data;
	};
	const { user, setUser } = useAppStore();

	const register = async () => {
		const usernameIsValid = await validateUsername(
			formValues.username,
			setErrorUsername,
			false
		);
		const passwordIsValid = validatePassword(
			formValues.password,
			setErrorPassword,
			false
		);
		const passwordsMatch = validatePasswordsMatch(
			formValues.password,
			formValues.password2,
			setErrorPasswordsDontMatch,
			false
		);

		if (!(usernameIsValid && passwordIsValid && passwordsMatch)) {
			toast.error("Please fix the errors before registering");
			return;
		}
		setForceDisableRegisterButton(true);
		setLoading(true);
		let failed = false;
		const response = await registerUserApiRequest({
			username: formValues.username,
			password: formValues.password,
		}).catch((err) => {
			toast.error("Failed to register: " + err?.response?.data?.error);
			failed = true;
		});
		if (!failed) {
			toast.success("Registration Successful");
			setUser(response.data.user);
		}
		setLoading(false);
		setForceDisableRegisterButton(false);
	};

	const disableRegisterButtonIfErrors = () => {
		if (ForceDisableRegisterButton) {
			setDisableRegisterButton(true);
			return true;
		}

		validateUsername(formValues.username, setErrorUsername);
		validatePassword(formValues.password, setErrorPassword);
		validatePassword(formValues.password2, setErrorPassword2);
		validatePasswordsMatch(
			formValues.password,
			formValues.password2,
			setErrorPasswordsDontMatch
		);

		if (
			errorPassword ||
			errorPassword2 ||
			errorPasswordsDontMatch ||
			errorUsername
		) {
			setDisableRegisterButton(true);
			return true;
		} else {
			setDisableRegisterButton(false);
			return false;
		}
	};

	const validatePassword = (
		password,
		setErrorPassword,
		ignore_init_state = true
	) => {
		if (password === "" && ignore_init_state) {
			return false;
		}
		setErrorPassword(null);
		if (password.length < 8) {
			setErrorPassword("Password must be at least 8 characters long");
			return false;
		}
		if (!/\d/.test(password)) {
			setErrorPassword("Password must contain a number");
			return false;
		}
		if (!/[a-z]/.test(password)) {
			setErrorPassword("Password must contain a lowercase letter");
			return false;
		}
		if (!/[A-Z]/.test(password)) {
			setErrorPassword("Password must contain an uppercase letter");
			return false;
		}
		if (!/\W/.test(password)) {
			setErrorPassword("Password must contain a special character");
			return false;
		}
		return true;
	};

	const validatePasswordsMatch = (
		password1,
		password2,
		setErrorPasswordsDontMatch,
		ignore_init_state = true
	) => {
		if (password1 === "" && password2 === "" && ignore_init_state) {
			return false;
		}
		if (password1 !== password2) {
			setErrorPasswordsDontMatch("Passwords do not match");
			return false;
		}
		setErrorPasswordsDontMatch(null);
		return true;
	};

	const validateUsername = async (
		username,
		setErrorUsername,
		ignore_init_state = true
	) => {
		if (username === "" && ignore_init_state) {
			return false;
		}
		if (username.length < 4) {
			setErrorUsername("Username must be at least 4 characters long");
			return false;
		}
		if (username.length > 20) {
			setErrorUsername("Username must be at most 20 characters long");
			return false;
		}
		if ((await userExistsRequest()).exists) {
			setErrorUsername("Username already exists");
			return false;
		}
		setErrorUsername(null);
		return true;
	};

	useEffect(() => {
		validateUsername(formValues.username, setErrorUsername);
		disableRegisterButtonIfErrors();
	});

	if (user) {
		return <Navigate to={"/"} />;
	}

	return (
		<div className="card bg-base-300 w-96 shadow-xl">
			<div className="card-body">
				<h2 className="card-title self-center">Register</h2>
				<h3 className="text-center text-xs text-gray-500">
					Create an account to continue
				</h3>
				<div className="divider" />

				<label className="form-control">
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
								validateUsername(event.target.value, setErrorUsername);
							}}
							value={formValues.username}
							placeholder="Username"
						/>
					</label>
					{errorUsername && (
						<div className="label">
							<span className="label-text-alt">{errorUsername}</span>
						</div>
					)}
				</label>
				<label className="form-control">
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
							onChange={(e) => {
								setFormValues({
									...formValues,
									password: e.target.value,
								});
								validatePassword(e.target.value, setErrorPassword);
								validatePasswordsMatch(
									e.target.value,
									formValues.password2,
									setErrorPasswordsDontMatch
								);
							}}
							value={formValues.password}
							placeholder="Password"
						/>
					</label>
					{(errorPassword || errorPasswordsDontMatch) && (
						<div className="label">
							<span className="label-text-alt">
								{errorPassword || errorPasswordsDontMatch}
							</span>
						</div>
					)}
				</label>
				<label className="form-control">
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
							onChange={(e) => {
								setFormValues({
									...formValues,
									password2: e.target.value,
								});
								validatePassword(e.target.value, setErrorPassword2);
								validatePasswordsMatch(
									formValues.password,
									e.target.value,
									setErrorPasswordsDontMatch
								);
							}}
							value={formValues.password2}
							placeholder="Confirm Password"
						/>
					</label>
					{(errorPassword2 || errorPasswordsDontMatch) && (
						<div className="label">
							<span className="label-text-alt">
								{errorPassword2 || errorPasswordsDontMatch}
							</span>
						</div>
					)}
				</label>
				<div className="card-actions mt-4 flex flex-col align-middle items-center justify-center">
					<button
						className="btn btn-primary w-3/6"
						disabled={disableRegisterButton}
						onClick={register}
					>
						{Loading ? (
							<div className="flex flex-row flex-nowrap items-center justify-center text-primary">
								<span className="loading m-1 loading-spinner text-primary" />
								<p>Registering...</p>
							</div>
						) : (
							"Register"
						)}
					</button>
					<Link className="btn" to="/login">
						Login
					</Link>
				</div>
			</div>
		</div>
	);
};

export default RegisterPage;
