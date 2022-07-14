import React from "react";
import Login from "../views/login";
import News from "../views/news/News";
import Detail from "../views/news/Detail";
import NewsSandBox from "../views/sandBox/NewsSandBox";
import { HashRouter, Route, Routes } from "react-router-dom";
import Home from "../views/sandBox/home/Home";
import UserList from "../views/sandBox/user-manage/UserList";
import RoleList from "../views/sandBox/right-manage/RoleList";
import RightList from "../views/sandBox/right-manage/RightList";
import NewsAdd from "../views/sandBox/news-manage/NewsAdd";
import NewsCategory from "../views/sandBox/news-manage/NewsCategory";
import NewsPreview from "../views/sandBox/news-manage/NewsPreview";
import NewsUpdate from "../views/sandBox/news-manage/NewsUpdate";
import NewsDraft from "../views/sandBox/news-manage/NewsDraft";
import Audit from "../views/sandBox/audit-manage/Audit";
import AuditList from "../views/sandBox/audit-manage/AuditList";
import Unpublished from "../views/sandBox/publish-manage/Unpublished";
import Published from "../views/sandBox/publish-manage/Published";
import Sunset from "../views/sandBox/publish-manage/Sunset";

export default function indexRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/news" element={<News />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/" element={<NewsSandBox />}>
          <Route path="/home" element={<Home />} />
          <Route path="/user-manage/list" element={<UserList />} />
          <Route path="/right-manage/role/list" element={<RoleList />} />
          <Route path="/right-manage/right/list" element={<RightList />} />
          <Route path="/news-manage/add" element={<NewsAdd />} />
          <Route path="/news-manage/category" element={<NewsCategory />} />
          <Route path="/news-manage/preview/:id" element={<NewsPreview />} />
          <Route path="/news-manage/update/:id" element={<NewsUpdate />} />
          <Route path="/news-manage/draft" element={<NewsDraft />} />
          <Route path="/audit-manage/audit" element={<Audit />} />
          <Route path="/audit-manage/list" element={<AuditList />} />
          <Route path="/publish-manage/unpublished" element={<Unpublished />} />
          <Route path="/publish-manage/published" element={<Published />} />
          <Route path="/publish-manage/sunset" element={<Sunset />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
