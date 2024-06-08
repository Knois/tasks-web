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
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <span>Email: </span>
          <span>{userStore.email}</span>
        </div>

        <div>
          <span>Name: </span>
          <span>{userStore.name}</span>
        </div>

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
