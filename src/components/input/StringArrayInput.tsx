import React, { useState } from "react";

type Props = {
  value: string[];
  onChange: React.Dispatch<React.SetStateAction<string[]>>;
};

const StringArrayInput: React.FC<Props> = ({ value, onChange }) => {
  const [email, setEmail] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleAddEmail = () => {
    if (email && !value.includes(email)) {
      // Проверка на дубликаты и пустой ввод
      onChange([...value, email]);
      setEmail("");
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault(); // предотвращаем отправку формы при нажатии Enter
      handleAddEmail();
    }
  };

  const removeEmail = (index: number) => {
    onChange(value.filter((_, idx) => idx !== index));
  };

  return (
    <div>
      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="email"
          value={email}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Add member email"
          className="form__input"
        />

        <button
          onClick={handleAddEmail}
          type="button"
          className="form__button form__button-small"
        >
          Add
        </button>
      </div>

      {value.length > 0 && (
        <ul>
          {value.map((email, index) => {
            const handleRemoveEmail = () => removeEmail(index);

            return (
              <li key={index}>
                <div className="form__item">
                  <span className="form__item__label">{email}</span>

                  <button
                    onClick={handleRemoveEmail}
                    className="form__button form__button-small"
                  >
                    Remove
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default StringArrayInput;
