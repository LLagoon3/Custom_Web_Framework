import React from "react";
import "../stylesheets/InputBox.css";

interface InputBoxProps {
  label: string;
  type: string;
  placeholder: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  required?: boolean;
}


const InputBox: React.FC<InputBoxProps> = ({
    label,
    type,
    placeholder,
    value,
    onChange,
    required = true,
}) => {
    return(
        <div className = "input-container" >
            <label>{label}</label>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
            />
        </div>
    )
};

export default InputBox;