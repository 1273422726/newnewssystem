import React, { useEffect, useState } from "react";
import Home from "../../views/sandBox/home/Home";
import UserList from "../../views/sandBox/user-manage/UserList";
import RoleList from "../../views/sandBox/right-manage/RoleList";
import RightList from "../../views/sandBox/right-manage/RightList";
// import Nopermission from '../../views/sandBox/nopermission/Nopermission'
import { Route, Routes } from "react-router-dom";
import NewsAdd from "../../views/sandBox/news-manage/NewsAdd";
import NewsCategory from "../../views/sandBox/news-manage/NewsCategory";
import NewsDraft from "../../views/sandBox/news-manage/NewsDraft";
import Audit from "../../views/sandBox/audit-manage/Audit";
import AuditList from "../../views/sandBox/audit-manage/AuditList";
import Unpublished from "../../views/sandBox/publish-manage/Unpublished";
import Published from "../../views/sandBox/publish-manage/Published";
import Sunset from "../../views/sandBox/publish-manage/Sunset";
import NewsPreview from "../../views/sandBox/news-manage/NewsPreview";
import NewsUpdate from "../../views/sandBox/news-manage/NewsUpdate";
import axios from "axios";
import { Spin } from "antd";
import { connect } from "react-redux";

const LocalRouterMap = {
  "/home": <Home />,
  "/user-manage/list": <UserList />,
  "/right-manage/role/list": <RoleList />,
  "/right-manage/right/list": <RightList />,
  "/news-manage/add": <NewsAdd />,
  "/news-manage/draft": <NewsDraft />,
  "/news-manage/category": <NewsCategory />,
  "/news-manage/preview/:id": <NewsPreview />,
  "/news-manage/update/:id": <NewsUpdate />,
  "/audit-manage/audit": <Audit />,
  "/audit-manage/list": <AuditList />,
  "/publish-manage/unpublished": <Unpublished />,
  "/publish-manage/published": <Published />,
  "/publish-manage/sunset": <Sunset />,
};

function NewsRouter(props) {
  const [backRouterList, setBackRouterList] = useState([]);
  useEffect(() => {
    Promise.all([axios.get(`/rights`), axios.get(`/children`)]).then((res) => {
      setBackRouterList([...res[0].data, ...res[1].data]);
    });
  }, []);
  const {
    role: { rights },
  } = JSON.parse(localStorage.getItem("token"));
  const checkRoute = (item) => {
    // console.log(item.key, item.pagepermisson)
    return (
      LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
    );
  };
  const checkUserPermission = (item) => {
    return rights.includes(item.key);
  };
  return (
    <div>
      <Spin size="large" spinning={props.isLoading}>
        <Routes>
          {backRouterList.map((item) => {
            if (checkRoute(item) && checkUserPermission(item)) {
              return (
                <Route
                  exact
                  path={item.key}
                  key={item.key}
                  element={LocalRouterMap[item.key]}
                />
              );
            }
            return null;
          })}
          <Route path="/" key="1" element={<Home />} />
        </Routes>
      </Spin>
    </div>
  );
}

/*
connect(
  //mapStateToProps
  //mapDispatchToProps
)(被包装的组件)
 */
const mapStateToProps = ({ LoadingReduces: { isLoading } }) => ({
  isLoading,
});

export default connect(mapStateToProps)(NewsRouter);
