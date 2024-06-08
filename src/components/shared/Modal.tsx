import React from "react";

type Props = {
  text: string;
  onOk: () => void;
  onCancel: () => void;
};

const Modal: React.FC<Props> = ({ text, onOk, onCancel }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <span className="modal__text">{text}</span>

        <div className="modal__buttons">
          <button onClick={onOk} className="modal__button modal__button-ok">
            OK
          </button>

          <button
            onClick={onCancel}
            className="modal__button modal__button-cancel"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Modal);
