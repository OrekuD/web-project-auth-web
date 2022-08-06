import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, TextInput } from "../../components";
import { ArrowLeftIcon, MailIcon, UserIcon } from "../../components/Icons";
import colors from "../../constants/colors";
import isAnyEmpty from "../../utils/isAnyEmpty";
import classes from "./index.module.scss";
import API from "../../constants/api";
import AuthenticationResponse from "../../network/responses/AuthenticationResponse";
import { AxiosResponse } from "axios";
import { userActions } from "../../store/slices/user.slice";
import SignUpRequest from "../../network/requests/SignUpRequest";
import { useSelectState } from "../../store/selectors";
import UpdateUserRequest from "../../network/requests/UpdateUserRequest";
import validateEmail from "../../utils/validateEmail";

const EditProfilePage = () => {
  const { user } = useSelectState();
  const [email, setEmail] = React.useState(user?.email || "");
  const [emailError, setEmailError] = React.useState("");
  const [firstName, setFirstName] = React.useState(user.firstName || "");
  const [lastName, setLastName] = React.useState(user.lastName || "");
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch<any>();

  const canProceed = React.useMemo(() => {
    if (emailError.trim().length > 0) {
      return false;
    }
    return !isAnyEmpty([email, firstName, lastName]);
  }, [email, firstName, lastName, emailError]);

  const handleSubmit = async () => {
    if (!canProceed || isLoading) {
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter valid E-Mail Address");
      return;
    }

    setIsLoading(true);

    const payload: UpdateUserRequest = {
      email: email.trim().toLowerCase(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      _id: user._id
    };
    try {
      const response = await API.client.put<
        SignUpRequest,
        AxiosResponse<AuthenticationResponse>
      >("/user/update", payload);

      dispatch(
        userActions.updateUser({
          user: {
            email: email.trim().toLowerCase(),
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            _id: user._id
          }
        })
      );
      setFirstName("");
      setEmail("");
      setLastName("");
      navigate("/profile");
      setIsLoading(false);
      return response.data;
    } catch (error: any) {
      setIsLoading(false);
      // console.log({ error: error?.list });
      if ((error?.list[0]?.msg as string).toLowerCase() === "bad request") {
        setEmailError("Email address is alreay taken");
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
      <p className={classes["title"]}>Update your profile</p>
      <TextInput
        value={firstName}
        onChange={setFirstName}
        placeholder="First name"
        rightIcon={<UserIcon width={24} height={24} color={colors.grey} />}
      />
      <TextInput
        value={lastName}
        onChange={setLastName}
        placeholder="Last name"
        rightIcon={<UserIcon width={24} height={24} color={colors.grey} />}
      />
      <TextInput
        value={email}
        onChange={(text) => {
          setEmail(text);
          if (emailError.length > 0) {
            if (!validateEmail(text)) {
              setEmailError("Please enter valid E-Mail Address");
            } else {
              setEmailError("");
            }
          }
        }}
        onBlur={() => {
          if (!validateEmail(email)) {
            setEmailError("Please enter valid E-Mail Address");
          } else {
            setEmailError("");
          }
        }}
        error={emailError}
        placeholder="Email"
        rightIcon={<MailIcon width={24} height={24} color={colors.grey} />}
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

export default EditProfilePage;
