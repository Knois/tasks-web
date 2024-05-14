import React, { memo, useState } from "react";

type Props = {
  array: string[];
  onChangeArray: React.Dispatch<React.SetStateAction<string[]>>;
  defaultValue?: string;
};

const StringArrayInput: React.FC<Props> = ({
  array,
  onChangeArray,
  defaultValue,
}) => {
  const [email, setEmail] = useState<string>("");

  const handleInputChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(value);
  };

  const handleAddEmail = () => {
    if (email && !array.includes(email)) {
      // Проверка на дубликаты и пустой ввод
      onChangeArray([...array, email]);
      setEmail("");
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault(); // предотвращаем отправку формы при нажатии Enter
      handleAddEmail();
    }
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

      {array.length > 0 && (
        <ul>
          {array.map((email, index) => {
            const handleRemoveEmail = () =>
              onChangeArray(array.filter((_, idx) => idx !== index));

            return (
              <li key={index}>
                <div className="form__item">
                  <span className="form__item__label">{email}</span>

                  {defaultValue !== email && (
                    <button
                      onClick={handleRemoveEmail}
                      className="form__button form__button-small"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default memo(StringArrayInput);
