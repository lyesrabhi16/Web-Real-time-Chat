import { useEffect } from "react";
import useAppStore from "../store.jsx";
import toast from "react-hot-toast";
import { logoutUserApiRequest } from "../api/users.js";
import { useNavigate } from "react-router";

const LogoutPage = () => {
	const { setUser } = useAppStore();
    const navigate = useNavigate();

	useEffect(() => {
		const logout = async () => {
			setUser(null);
			localStorage.removeItem("token");
			sessionStorage.removeItem("user");
			const response = await logoutUserApiRequest({ onFail: (msg) => {
                toast.error("Failed to logout:"+msg);
				navigate("/");
            } })
			if (response){
				toast.success("Logout Successful");
				navigate("/");
			}
		};
		const logout_timeout = setTimeout(logout, 1000);
		return () => clearTimeout(logout_timeout);
	});

	return (
		<div className="flex flex-col items-center justify-center">
			<span className="loading loading-spinner text-error w-12" />
			<p className="-mr-5 mt-2">Logout...</p>
		</div>
	);
};

export default LogoutPage;
