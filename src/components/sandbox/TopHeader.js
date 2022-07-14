import React from "react";
import { Layout, Dropdown, Menu, Avatar } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { connect } from "react-redux";

const { Header } = Layout;

function TopHeader(props) {
  const changeCollapsed = () => {
    // 改变State中isCollapsed的值
    props.changeCollapsed();
  };

  const {
    username,
    role: { roleName },
  } = JSON.parse(localStorage.getItem("token"));

  const menu = (
    <Menu>
      <Menu.Item key={1}>{roleName}</Menu.Item>
      <Menu.Item
        key={"exit"}
        danger
        onClick={() => {
          localStorage.removeItem("token");
        }}
      >
        <a href="#/login">退出</a>
      </Menu.Item>
    </Menu>
  );

  return (
    <Header className="site-layout-background" style={{ padding: "0 16px" }}>
      {props.isCollapsed ? (
        <MenuUnfoldOutlined onClick={changeCollapsed} />
      ) : (
        <MenuFoldOutlined onClick={changeCollapsed} />
      )}

      <div style={{ float: "right" }}>
        <span>欢迎{username}回来</span>
        <Dropdown overlay={menu}>
          <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  );
}

/*

connect(
  //mapStateToProps
  //mapDispatchToProps

)(被包装的组件)

 */

const mapStateToProps = ({ CollapsedReducers: { isCollapsed } }) => {
  return {
    isCollapsed,
  };
};
const mapDispatchToProps = {
  changeCollapsed() {     //自定义方法
    return {
      type: "change_collapsed",   //名字自定义
    };
  },
};
export default connect(mapStateToProps, mapDispatchToProps)(TopHeader);

