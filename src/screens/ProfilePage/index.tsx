import { SettingsIcon, UserCircleIcon } from "../../components/Icons";
import colors from "../../constants/colors";
import { useSelectState } from "../../store/selectors";
import classes from "./index.module.scss";

const ProfilePage = () => {
  const { user } = useSelectState();
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
        <button className={classes["row-item"]}>
          <SettingsIcon width={24} height={24} color={colors.darkgrey} />
          <p>Settings</p>
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
