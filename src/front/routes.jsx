// Import necessary components and functions from react-router-dom.
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from "react-router-dom";

import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import { LoginSignup } from "./pages/LoginSignup";
import { Profile } from "./pages/Profile";              // <-- NUEVO
import { ProtectedRoute } from "./context/ProtectedRoute"; // <-- NUEVO

export const router = createBrowserRouter(
    createRoutesFromElements(

        <Route
            path="/"
            element={<Layout />}
            errorElement={<h1>Not found!</h1>}
        >

            <Route path="/" element={<Home />} />
            <Route path="/single/:theId" element={<Single />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/loginsignup" element={<LoginSignup />} />

            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                }
            />

        </Route>
    )
);