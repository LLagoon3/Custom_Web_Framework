import React from 'react';
import '../stylesheets/Button.css';

interface ButtonProps {
  text: string;  
  size: 'small' | 'large';
  onClick: () => void;  
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ text, size, onClick, disabled = false }) => {
  return (
    <button 
      className={`button ${size}`} 
      onClick={onClick} 
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;
