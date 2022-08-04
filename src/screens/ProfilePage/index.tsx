import { AxiosResponse } from "axios";
import React from "react";
import { useDispatch } from "react-redux";
import { LogoutIcon, UserCircleIcon } from "../../components/Icons";
import Loader from "../../components/Loader";
import colors from "../../constants/colors";
import OkResponse from "../../network/responses/OkResponse";
import { useSelectState } from "../../store/selectors";
import { authenticationActions } from "../../store/slices/authentication.slice";
import { userActions } from "../../store/slices/user.slice";
import classes from "./index.module.scss";
import API from "../../constants/api";

const ProfilePage = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { user } = useSelectState();
  const dispatch = useDispatch();

  const signOut = async () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);

    try {
      const response = await API.client.get<any, AxiosResponse<OkResponse>>(
        "/user/sign-out"
      );
      dispatch(authenticationActions.signOut());
      dispatch(userActions.signOut());
      setIsLoading(false);
      return response.data;
    } catch (error) {
      // dispatch(authenticationActions.signOut());
      // dispatch(userActions.signOut());
      setIsLoading(false);
    }
  };

  return (
    <div className={classes["container"]}>
      <div className={classes["profile"]}>
        <UserCircleIcon width={80} height={80} color={colors.darkgrey} />
        <p
          className={classes["label"]}
        >{`${user.firstName} ${user.lastName}`}</p>
        <p className={classes["label"]}>{user.email}</p>
      </div>
      <div className={classes["menu"]}>
        <button className={classes["row-item"]} onClick={signOut}>
          <LogoutIcon width={16} height={16} color={colors.accent} />
          {isLoading ? <Loader color={colors.primary} /> : <p>Logout</p>}
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
