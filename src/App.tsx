import { endpoints } from "api/endpoints";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { setEmailToStore, setPasswordToStore, setTokenToStore } from "utils";

function App() {
  const { userStore } = useStore();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [mode, setMode] = useState<"login" | "register">("login");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const changeMode = () => {
    if (mode === "register") {
      setMode("login");
    } else {
      setMode("register");
    }
  };

  const getJwt = async () => {
    setIsLoading(true);

    const user = { email, password };

    try {
      const response = await fetch(endpoints.auth.jwt, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        const result = await response.json();
        setTokenToStore(result.jwt_token);
        setEmailToStore(email);
        setPasswordToStore(password);
        userStore.getUser();
      } else {
        const error = await response.text();
        alert(error);
      }
    } catch {
      alert("Ошибка при получении токена");
    } finally {
      setIsLoading(false);
    }
  };

  const processRegister = async () => {
    setIsLoading(true);

    const user = { name, email, password };

    try {
      const response = await fetch(endpoints.auth.user, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        await getJwt();
      } else {
        const error = await response.text();
        alert(error);
      }
    } catch {
      alert("Ошибка при попытке зарегистрироваться");
    } finally {
      setIsLoading(false);
    }
  };

  const buttonAction = () => {
    if (mode === "register") {
      processRegister();
    } else {
      getJwt();
    }
  };

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      {mode === "register" && (
        <input onChange={(e) => setName(e.target.value)} value={name} />
      )}

      <input onChange={(e) => setEmail(e.target.value)} value={email} />
      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      <button
        title={mode === "register" ? "Зарегистрироваться" : "Войти"}
        type="submit"
        onClick={() => buttonAction()}
      >
        Login
      </button>

      <button
        title={mode === "register" ? "Войти" : "Регистрация"}
        type="submit"
        onClick={() => changeMode()}
      />
    </div>
  );
}

export default observer(App);
