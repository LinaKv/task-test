import React from "react";
import { useEffect } from "react";
import { useState } from "react";

function SelectForm({ options, onData, type, isNewTo, isNewFrom }) {
  const [inputValue, setInputValue] = useState("");
  const [suggestedOptions, setSuggestedOptions] = useState([]);

  useEffect(() => {
    // not to render when name exists
    if (!options.some((el) => el.name === inputValue)) {
      setSuggestedOptions(options);
    }
  }, [options]);

  const handleChange = (event) => {
    const value = event.target.value;
    setInputValue(value);

    if (type === "from") {
      if (!value) {
        setSuggestedOptions(options);
      } else {
        // filter
        const filteredOptions = options.filter((option) => option.name.toLowerCase().includes(value.toLowerCase()));
        setSuggestedOptions(filteredOptions);
      }
    }
  };

  const handleSelectOption = (option) => {
    const data = {
      type: type,
      value: option,
    };
    onData(data);
    setSuggestedOptions([]);
    setInputValue(option.name);
  };

  const onClick = () => {
    setSuggestedOptions(options);
  };

  return (
    <div className='dropdown'>
      <input
        tabIndex={0}
        type='text'
        value={inputValue}
        onChange={handleChange}
        className='input input-bordered w-full max-w-xs z-0'
        onClick={onClick}
      />
      <ul
        tabIndex={0}
        className={
          suggestedOptions.length > 0
            ? "dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full mt-1 z-10 font-jakarta"
            : ""
        }
      >
        {suggestedOptions.map((option, index) => (
          <li
            className='text-base cursor-pointer mt-1'
            key={index}
            onClick={() => handleSelectOption(option)}
          >
            {option.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SelectForm;
