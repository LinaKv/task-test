import React from "react";
import { useState } from "react";

function Input(props) {
  const [amountData, setAmountData] = useState("");

  const handleKeyPress = (e) => {
    const keyCode = e.keyCode || e.which;
    const keyValue = String.fromCharCode(keyCode);
    const isNumber = /^[0-9.]+$/.test(keyValue);
    if (!isNumber) {
      e.preventDefault();
    }
  };

  const onChange = (e) => {
    const value = e.target.value;
    setAmountData(value);
    const data = { type: props.type, value: value };
    props.onData(data);
  };

  const onBlur = () => {
    if (props.amountFormat) {
      setAmountData(props.amountFormat);
    }
  };

  return (
    <div>
      <input
        type='string'
        className={
          props.isAmountCorrect
            ? "input input-bordered w-full max-w-xs"
            : "input input-bordered w-full max-w-xs input-error border-2"
        }
        placeholder='Amount'
        id='Amount'
        value={amountData}
        onChange={onChange}
        onKeyPress={handleKeyPress}
        onBlur={onBlur}
      />
    </div>
  );
}

export default Input;
