import React from "react";
import styles from "./ApiKeyInput.module.css";

type InputProps = {
  value: string;
  onChange: (value: string) => void;
};

export function ApiKeyInput({ value, onChange }: InputProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className={styles.root}>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="Your API key (optional)"
          aria-label="API key"
        />
      </div>
    </div>
  );
}
