import { memo } from "react";
import { Link } from "react-router-dom";

const ErrorPage = () => (
  <div className="screenbox">
    <span className="board__title">Error 404</span>

    <br />

    <span className="board__title">Page not found...</span>

    <br />

    <Link to="/">
      <button className="form__button form__button-small">Home</button>
    </Link>
  </div>
);

export default memo(ErrorPage);
