import React from "react";
import colors from "../../constants/colors";
import Loader from "../Loader";
import classes from "./index.module.scss";

interface Props {
  label: string;
  onClick: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
}

const Button = (props: Props) => {
  return (
    <button
      className={classes["button"]}
      onClick={props.onClick}
      disabled={props.isDisabled}
    >
      {props.isLoading ? (
        <Loader color={colors.white} />
      ) : (
        <p className={classes["label"]}>{props.label}</p>
      )}
    </button>
  );
};

export default Button;
