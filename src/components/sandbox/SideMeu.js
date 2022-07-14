import React, { useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import "./index.css";
import { UserOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom"; //路由
import { connect } from "react-redux";

const { Sider } = Layout;
const { SubMenu } = Menu;

const iconList = {
  "/home": <UserOutlined />,
  "/user-manage": <UserOutlined />,
  "/user-manage/list": <UserOutlined />,
  "/right-manage": <UserOutlined />,
  "/right-manage/role/list": <UserOutlined />,
  "/right-manage/right/list": <UserOutlined />,
  //.......
};

function SideMeu(props) {
  let navigate = useNavigate();
  const [meun, setMeun] = useState([]);
  useEffect(() => {
    axios.get("/rights?_embed=children").then((res) => {
      //调用接口获取数据
      setMeun(res.data); //更新渲染数据
    });
  }, []);

  const {
    role: { rights },
  } = JSON.parse(window.localStorage.getItem("token"));
  const checkPagePermission = (item) => {
    return item.pagepermisson && rights.includes(item.key);
  };
  const urlParams = new URL(window.location.href); //获取路由路径
  // const hrefpa = [urlParams?.hash.split('#')[1]];
  const pathname = [urlParams?.hash.split("#")[1]]; //切割
  // console.log("pathname:", pathname);

  const renderMenu = (menuList) => {
    return menuList.map((item) => {
      if (item.children?.length > 0 && checkPagePermission(item)) {
        return (
          <SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
            {renderMenu(item.children)}
          </SubMenu>
        );
      }

      return (
        checkPagePermission(item) && (
          <Menu.Item
            key={item.key}
            icon={iconList[item.key]}
            onClick={() => {
              //获取后台数据
              navigate(item.key); // props.history.push(item.key)  移除换成了navigate(item.key)
            }}
          >
            {item.title}
          </Menu.Item>
        )
      );
    });
  };
  return (
    <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
      <div style={{ display: "flex", height: "100%", flexDirection: "column" }}>
        <div className="logo">全球新闻后台系统</div>
        <div style={{ flex: 1, overflow: "auto" }}>
          <Menu
            theme="dark"
            mode="inline"
            className="aaaaaaa"
            selectedKeys={pathname}
            defaultSelectedKeys={pathname}
          >
            {renderMenu(meun)}
          </Menu>
        </div>
      </div>
    </Sider>
  );
}
/*
connect(
  //mapStateToProps
  //mapDispatchToProps
)(被包装的组件)
 */
const mapStateToProps = ({ CollapsedReducers: { isCollapsed } }) => ({
  isCollapsed,
});

export default connect(mapStateToProps)(SideMeu);
