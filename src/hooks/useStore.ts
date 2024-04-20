import { createContext, useContext } from "react";

import { stores } from "../store";

export const StoreContext = createContext(stores);

export const useStore = () => useContext(StoreContext);
