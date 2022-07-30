import React from "react";
import classes from "./index.module.scss";

interface Props {
  color: string;
}

const Loader = (props: Props) => {
  return (
    <div className={classes["lds-ring"]}>
      <div
        style={{
          borderColor: `${props.color} transparent transparent transparent`
        }}
      />
      <div
        style={{
          borderColor: `${props.color} transparent transparent transparent`
        }}
      />
      <div
        style={{
          borderColor: `${props.color} transparent transparent transparent`
        }}
      />
      <div
        style={{
          borderColor: `${props.color} transparent transparent transparent`
        }}
      />
    </div>
  );
};

export default Loader;
