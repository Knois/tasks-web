import API from "api/api";
import Loading from "components/Loading";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { setTokenToStore } from "utils";

const Auth = () => {
  const { userStore } = useStore();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [mode, setMode] = useState<"login" | "register">("login");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const toggleMode = () =>
    setMode((prevMode) => (prevMode === "login" ? "register" : "login"));

  const processLogin = async () => {
    setIsLoading(true);

    try {
      const {
        data: { jwt_token },
      } = await API.login({ email, password });
      setTokenToStore(jwt_token);
      await userStore.getUser();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const processRegister = async () => {
    setIsLoading(true);

    await API.register({ name, email, password })
      .then(async () => {
        await processLogin();
      })
      .catch((error) => {
        console.warn(error);
        setIsLoading(false);
      });
  };

  const onSubmit = () => {
    if (mode === "register") {
      processRegister();
    } else {
      processLogin();
    }
  };

  if (isLoading) {
    return (
      <div className="auth">
        <Loading />
      </div>
    );
  }

  return (
    <div className="auth">
      <form onSubmit={onSubmit} className="form">
        {mode === "register" && (
          <div className="form__box">
            <label className="form__label">Username</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="form__input"
            />
          </div>
        )}

        <div className="form__box">
          <label className="form__label">Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form__input"
          />
        </div>

        <div className="form__box">
          <label className="form__label">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form__input"
          />
        </div>

        <button type="submit" className="form__button">
          GO
        </button>
      </form>

      <button onClick={toggleMode} className="form__button form__button-link">
        {mode === "login" ? "Sign up" : "Sign in"}
      </button>
    </div>
  );
};

export default observer(Auth);
