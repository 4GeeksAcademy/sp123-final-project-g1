import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import { LoginSignup } from "./pages/LoginSignup.jsx";
import { Profile } from "./pages/Profile.jsx";
import { ProtectedRoute } from "./context/ProtectedRoute";
import { PublicProfile } from "./pages/PublicProfile.jsx";
import { RegionPage } from "./pages/RegionPage.jsx";
import { About } from "./pages/About.jsx";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>

      <Route path="/" element={<Home />} />
      <Route path="/single/:theId" element={<Single />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/loginsignup" element={<LoginSignup />} />
      <Route path="/about" element={<About />} />

      {/* PERFIL PÚBLICO */}
      <Route path="/public-profile/:alias" element={<PublicProfile />} />

      {/* PERFIL PRIVADO */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* REGIÓN / PAÍS */}
      <Route path="/region/:country" element={<RegionPage />} />

    </Route>
  )
);
