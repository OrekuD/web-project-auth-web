import { Routes, Route, Navigate } from "react-router-dom";
import { useSelectState } from "./store/selectors";
import SignUpPage from "./screens/SignUpPage";
import SignInPage from "./screens/SignInPage";
import ProfilePage from "./screens/ProfilePage";
import EditProfilePage from "./screens/EditProfilePage";
import ChangePasswordPage from "./screens/ChangePasswordPage";

const App = () => {
  const { authentication } = useSelectState();

  return (
    <div className={"app-main-container"}>
      <Routes>
        {authentication.isAuthenticated ? (
          <>
            <Route path="profile" element={<ProfilePage />} />
            <Route path="profile/update" element={<EditProfilePage />} />
            <Route
              path="profile/change-password"
              element={<ChangePasswordPage />}
            />
          </>
        ) : (
          <>
            <Route path="sign-in" element={<SignInPage />} />
            <Route path="sign-up" element={<SignUpPage />} />
          </>
        )}
        <Route
          path="*"
          element={
            <Navigate
              to={authentication.isAuthenticated ? "/profile" : "/sign-in"}
              replace
            />
          }
        />
      </Routes>
    </div>
  );
};

export default App;
