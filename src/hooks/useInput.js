import { useState } from 'react';

export default function useInput() {
  const [inputs, setInputs] = useState({});

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const clearInputs = () => {
    setInputs({});
  };

  return {
    inputs,
    handleChange,
    clearInputs,
  };
}
