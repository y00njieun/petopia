import React from 'react';

interface ButtonProps {
  text: string;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ text, type = 'button', className = '', disabled, onClick }) => {
  return (
    <button type={type} className={`btn ${className}`} disabled={disabled} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
