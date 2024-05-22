import { makeAutoObservable } from "mobx";

const app = () => {
  return makeAutoObservable(
    {
      isExpandedSidebar: true as boolean,

      setIsExpandedSidebar(bool: boolean) {
        this.isExpandedSidebar = bool;
      },
    },
    {},
  );
};

export default app;
