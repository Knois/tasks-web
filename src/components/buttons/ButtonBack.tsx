import { ReactComponent as Icon } from "assets/svg/arrow_back.svg";
import React from "react";
import { useNavigate } from "react-router-dom";
type Props = { title: string };

const ButtonBack: React.FC<Props> = ({ title }) => {
  const navigate = useNavigate();

  const handleClick = () => navigate(-1);

  return (
    <button onClick={handleClick} className="button button-back">
      <Icon />

      {title}
    </button>
  );
};

export default ButtonBack;
