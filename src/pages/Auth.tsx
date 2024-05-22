import API from "api/api";
import Loading from "components/shared/Loading";
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
        console.log(error);
      })
      .finally(() => setIsLoading(false));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mode === "register" ? await processRegister() : await processLogin();
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <form onSubmit={onSubmit} className="form">
        {mode === "register" && (
          <div className="form__box">
            <label className="form__label">Username</label>
            <input
              type="text"
              value={name}
              onChange={({ target: { value } }) => setName(value)}
              required
              className="form__input"
              autoComplete="name"
            />
          </div>
        )}

        <div className="form__box">
          <label className="form__label">Email</label>
          <input
            type="text"
            value={email}
            onChange={({ target: { value } }) => setEmail(value)}
            required
            className="form__input"
            autoComplete="email"
          />
        </div>

        <div className="form__box">
          <label className="form__label">Password</label>
          <input
            type="password"
            value={password}
            onChange={({ target: { value } }) => setPassword(value)}
            required
            className="form__input"
          />
        </div>

        <button type="submit" className="form__button">
          GO
        </button>
      </form>

      <button
        onClick={toggleMode}
        className="form__button form__button-link"
        type="button"
      >
        {mode === "login" ? "Sign up" : "Sign in"}
      </button>
    </>
  );
};

export default observer(Auth);
