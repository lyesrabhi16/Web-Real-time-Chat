import { Link, Route, Routes } from "react-router";
import "./App.css";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useEffect } from "react";
import useAppStore from "./store.jsx";
import LogoutPage from "./pages/LogoutPage.jsx";

function App() {
	const { user,fetchUser } = useAppStore();

	useEffect(() => {
		if (user === null){
			fetchUser();
		}
	}, [fetchUser, user]);

	return (
		<div className="App w-screen h-screen flex justify-center items-center">
			<Routes>
				<Route index element={<h1>Index Page</h1>} />

				<Route
					path="/protected"
					element={
						<ProtectedRoute>
							<h1>Protected Page</h1>
							<Link to="/logout" className="btn btn-error">Logout</Link>
						</ProtectedRoute>
					}
				/>

				<Route path="/login" element={<LoginPage />} />
				<Route path="/register" element={<RegisterPage />} />

				<Route
					path="/logout"
					element={
						<ProtectedRoute>
							<LogoutPage />
						</ProtectedRoute>
					}
				/>

				{/* 
            			//TODO: Add a 404 Not Found page
        		*/}
				<Route path="*" element={<h1>404 Not Found</h1>} />
			</Routes>
			<Toaster />
		</div>
	);
}

export default App;
