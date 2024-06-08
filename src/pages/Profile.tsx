import Modal from "components/shared/Modal";
import { useModal } from "hooks/useModal";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react-lite";

const Profile = () => {
  const { userStore } = useStore();

  const { isVisible, modalOptions, openModal, closeModal } = useModal();

  const logout = () => userStore.logout();

  const handleClick = () => {
    openModal(`Are you sure you want to log out?`, () => {
      logout();
      closeModal();
    });
  };

  return (
    <>
      <div className="board">
        <span className="board__title">Email: {userStore.email}</span>

        <span className="board__title">Name: {userStore.name}</span>

        <button
          onClick={handleClick}
          className="form__button form__button-small"
        >
          Log out
        </button>
      </div>

      {isVisible && modalOptions && (
        <Modal
          text={modalOptions.text}
          onOk={modalOptions.onOk}
          onCancel={closeModal}
        />
      )}
    </>
  );
};

export default observer(Profile);
