import CardAddNew from "components/cards/CardAddNew";
import CardSpace from "components/cards/CardSpace";
import Loading from "components/shared/Loading";
import { useStore } from "hooks/useStore";
import { observer } from "mobx-react-lite";

const Spaces = () => {
  const { userStore } = useStore();

  const userSpaces = userStore.spaces
    .filter((space) => space.creatorEmail === userStore.email)
    .map((space) => <CardSpace key={space.id} space={space} />);

  const guestSpaces = userStore.spaces
    .filter((space) => space.creatorEmail !== userStore.email)
    .map((space) => <CardSpace key={space.id} space={space} />);

  if (userStore.isLoadingSpaces) {
    return (
      <div className="board board-loading">
        <Loading />
      </div>
    );
  }

  return (
    <div className="board">
      <span className="board__title">My spaces</span>

      <div className="board__list">
        {userSpaces}

        <CardAddNew to="create-space" />
      </div>

      {guestSpaces.length > 0 && (
        <>
          <span className="board__title">Guest spaces</span>

          <div className="board__list">{guestSpaces}</div>
        </>
      )}
    </div>
  );
};

export default observer(Spaces);
