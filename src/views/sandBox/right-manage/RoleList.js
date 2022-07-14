import React, { useEffect, useState } from "react";
import { Table, Button, message, Modal, Tree } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
const { confirm } = Modal;

export default function RoleList() {
  const [dataSource, setDataSource] = useState([]); //全部状态
  const [isModalVisible, setisModalVisible] = useState(false); //弹窗
  const [rightList, setRightList] = useState(false); //树形
  const [currentRights, setCurrentRights] = useState([]);
  const [currentId, setCurrentId] = useState(0);
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id) => {
        return <b>{id}</b>;
      },
    },
    {
      title: "角色名称",
      dataIndex: "roleName",
      render: (roleName) => {
        return roleName;
      },
    },
    {
      title: "操作",
      render: (item) => {
        return (
          <div>
            <Button
              danger
              type="primary"
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => confirmMethod(item)}
            />
            &nbsp; &nbsp; &nbsp;
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => {
                setisModalVisible(true);
                setCurrentRights(item.rights);
                setCurrentId(item.id);
              }}
            />
          </div>
        );
      },
    },
  ];
  useEffect(() => {
    //请求角色数据
    axios.get(`/roles`).then((res) => {
      setDataSource(res.data);
    });
  }, []);

  useEffect(() => {
    //请求用户数据
    axios.get(`/rights?_embed=children`).then((res) => {
      setRightList(res.data);
    });
  }, []);
  const confirmMethod = (item) => {
    //提示框
    confirm({
      title: "Are you sure delete this task?",
      icon: <ExclamationCircleOutlined />,
      content: "您确定要删除吗？",
      okText: "确认",
      okType: "danger",
      cancelText: "取消",
      onOk() {
        deleteMethod(item);
      },
      onCancel() {
        // console.log('Cancel');
      },
    });
  };

  const deleteMethod = (item) => {
    //删除
    setDataSource(dataSource.filter((data) => data.id !== item.id));
    axios.delete(`/roles/${item.id}`).then((res) => {
      message.success(`删除成功！`);
    });
  };

  const handleOk = () => {
    setisModalVisible(false);
    //同步dataSource
    setDataSource(
      dataSource.map((item) => {
        if (item.id === currentId) {
          return {
            ...item,
            rights: currentRights,
          };
        }
        return item;
      })
    );
    axios.patch(`/roles/${currentId}`, {
      rights: currentRights,
    });
  };

  const handleCancel = () => {
    setisModalVisible(false);
  };

  const onSelect = (selectedKeys, info) => {
    console.log("selected", selectedKeys, info);
  };

  const onCheck = (checkedKeys, info) => {
    setCurrentRights(checkedKeys.checked);
  };
  return (
    <div>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={{ pageSize: 5 }}
        rowKey={(item) => item.id}
      />{" "}
      {/**rowKey 当表没有key值，提供给表一个key值 */}
      <Modal
        title="权限分配"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Tree
          checkable
          checkedKeys={currentRights}
          onSelect={onSelect}
          onCheck={onCheck}
          checkStrictly={true}
          treeData={rightList}
        />
      </Modal>
    </div>
  );
}
