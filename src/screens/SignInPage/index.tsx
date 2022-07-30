import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button, TextInput } from "../../components";
import { EyeCancelIcon, EyeIcon, MailIcon } from "../../components/Icons";
import colors from "../../constants/colors";
import SignInRequest from "../../network/requests/SignInRequest";
import isAnyEmpty from "../../utils/isAnyEmpty";
import classes from "./index.module.scss";
import API from "../../constants/api";
import AuthenticationResponse from "../../network/responses/AuthenticationResponse";
import { AxiosResponse } from "axios";
import { authenticationActions } from "../../store/slices/authentication.slice";
import { userActions } from "../../store/slices/user.slice";

const SignInPage = () => {
  const [email, setEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const dispatch = useDispatch<any>();

  const canProceed = React.useMemo(() => {
    if (emailError.trim().length > 0) {
      return false;
    }
    return !isAnyEmpty([email, password]);
  }, [email, password, emailError]);

  const handleSubmit = async () => {
    if (!canProceed || isLoading) {
      return;
    }
    setIsLoading(true);

    const payload = {
      email: email.trim().toLowerCase(),
      password: password.trim()
    };
    try {
      const response = await API.client.post<
        SignInRequest,
        AxiosResponse<AuthenticationResponse>
      >("/user/sign-in", payload);
      dispatch(
        authenticationActions.addAuthState({
          accessToken: response.data.accessToken
        })
      );
      dispatch(userActions.updateUser({ user: response.data.user }));
      setIsLoading(false);
      return response.data;
    } catch (error: any) {
      setIsLoading(false);
      // console.log({ error: error?.list });
      if ((error?.list[0]?.msg as string).toLowerCase() === "unauthorized") {
        setEmailError("Your credentials are invalid");
      }
    }
  };

  return (
    <div className={classes["container"]}>
      <p className={classes["title"]}>Welcome back</p>
      <TextInput
        value={email}
        onChange={(text) => {
          setEmail(text);
          setEmailError("");
        }}
        error={emailError}
        placeholder="Email"
        rightIcon={<MailIcon width={24} height={24} color={colors.grey} />}
      />
      <TextInput
        value={password}
        onChange={setPassword}
        placeholder="Password"
        type={showPassword ? "text" : "password"}
        rightIcon={
          <button
            onClick={() => setShowPassword(!showPassword)}
            style={{ marginTop: 2 }}
          >
            {!showPassword ? (
              <EyeCancelIcon width={24} height={24} color={colors.grey} />
            ) : (
              <EyeIcon width={24} height={24} color={colors.grey} />
            )}
          </button>
        }
      />
      <p className={classes["label"]}>
        Don't have an account? <Link to="/sign-up">Create one</Link>
      </p>
      <Button
        label="sign in"
        onClick={handleSubmit}
        isDisabled={isLoading || !canProceed}
        isLoading={isLoading}
      />
    </div>
  );
};

export default SignInPage;
