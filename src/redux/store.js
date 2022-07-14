//createStore 遗弃，改成 legacy_createStore
import { legacy_createStore, combineReducers } from "redux";
import { CollapsedReducers } from "./reducers/CollapsedReducers";
import { LoadingReduces } from "./reducers/LoadingReduces";

//数据持久化
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
//

const persistConfig = {
  //数据持久化存储
  key: "persist",
  storage,
  blacklist: ["LoadingReducer"], //黑名单
  // whitelist:['LoadingReducer']   白名单
};

const reducers = combineReducers({
  //使用combineReducers从许多中创建单个根减速器
  CollapsedReducers,
  LoadingReduces,
});

const persistedReducer = persistReducer(persistConfig, reducers);

const store = legacy_createStore(persistedReducer);

const persistor = persistStore(store);
export { store, persistor };
