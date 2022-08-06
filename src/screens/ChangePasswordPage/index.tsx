import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextInput } from "../../components";
import { ArrowLeftIcon, EyeCancelIcon, EyeIcon } from "../../components/Icons";
import colors from "../../constants/colors";
import isAnyEmpty from "../../utils/isAnyEmpty";
import classes from "./index.module.scss";
import API from "../../constants/api";
import AuthenticationResponse from "../../network/responses/AuthenticationResponse";
import { AxiosResponse } from "axios";
import SignUpRequest from "../../network/requests/SignUpRequest";
import { useSelectState } from "../../store/selectors";
import ChangePasswordRequest from "../../network/requests/ChangePasswordRequest";

const ChangePasswordPage = () => {
  const { user } = useSelectState();
  const [passwordError, setPasswordError] = React.useState("");
  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [showOldPassword, setShowOldPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const navigate = useNavigate();

  const canProceed = React.useMemo(() => {
    return !isAnyEmpty([oldPassword, newPassword]);
  }, [oldPassword, newPassword]);

  const handleSubmit = async () => {
    if (!canProceed || isLoading) {
      return;
    }

    setIsLoading(true);

    const payload: ChangePasswordRequest = {
      oldPassword: oldPassword.trim(),
      newPassword: newPassword.trim(),
      _id: user._id
    };
    try {
      const response = await API.client.put<
        SignUpRequest,
        AxiosResponse<AuthenticationResponse>
      >("/user/change-password", payload);

      setOldPassword("");
      setNewPassword("");
      navigate("/profile");
      setIsLoading(false);
      return response.data;
    } catch (error: any) {
      setIsLoading(false);
      console.log({ error: error?.list });
      if ((error?.list[0]?.msg as string).toLowerCase() === "bad request") {
        setPasswordError("Your password is incorrect");
      }
    }
  };

  return (
    <div className={classes["container"]}>
      <button
        className={classes["back-button"]}
        onClick={() => navigate("/profile")}
      >
        <ArrowLeftIcon width={24} height={24} color={colors.white} />
      </button>
      <p className={classes["title"]}>Change your password</p>
      <TextInput
        value={oldPassword}
        onChange={(text) => {
          setOldPassword(text);
          setPasswordError("");
        }}
        placeholder="Old password"
        type={showOldPassword ? "text" : "password"}
        rightIcon={
          <button
            onClick={() => setShowOldPassword((prevValue) => !prevValue)}
            style={{ marginTop: 2 }}
          >
            {!showOldPassword ? (
              <EyeCancelIcon width={24} height={24} color={colors.grey} />
            ) : (
              <EyeIcon width={24} height={24} color={colors.grey} />
            )}
          </button>
        }
        error={passwordError}
      />
      <TextInput
        value={newPassword}
        onChange={setNewPassword}
        placeholder="New password"
        type={showNewPassword ? "text" : "password"}
        rightIcon={
          <button
            onClick={() => setShowNewPassword((prevValue) => !prevValue)}
            style={{ marginTop: 2 }}
          >
            {!showNewPassword ? (
              <EyeCancelIcon width={24} height={24} color={colors.grey} />
            ) : (
              <EyeIcon width={24} height={24} color={colors.grey} />
            )}
          </button>
        }
      />
      <Button
        label="Update"
        onClick={handleSubmit}
        isDisabled={isLoading || !canProceed}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ChangePasswordPage;
