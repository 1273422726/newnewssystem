import React, { useState, useEffect } from "react";
import { Modal, Table, Tag, Button, message, Popover, Switch } from "antd";
import axios from "axios";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
const { confirm } = Modal;

export default function RightList() {
  useEffect(() => {
    axios.get("/rights?_embed=children").then((res) => {
      const list = res.data;
      list.forEach((element) => {
        if (element.children.length === 0) {
          element.children = "";
        }
      });
      setDataSource(list);
    });
  }, []);
  const [dataSource, setDataSource] = useState([]);
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id) => {
        return <b>{id}</b>;
      },
    },
    {
      title: "权限名称",
      dataIndex: "title",
    },
    {
      title: "权限路径",
      dataIndex: "key",
      render: (key) => {
        return <Tag color="orange">{key}</Tag>;
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
            <Popover
              content={
                <Switch
                  defaultChecked
                  checked={item.pagepermisson}
                  onChange={() => switchMethod(item)}
                />
              }
              title="配置项"
              trigger={item.pagepermisson === undefined ? "" : "click"}
            >
              <Button
                type="primary"
                shape="circle"
                icon={<EditOutlined />}
                disabled={item.pagepermisson === undefined}
              />
            </Popover>
          </div>
        );
      },
    },
  ];
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
        console.log("Cancel");
      },
    });
  };

  const deleteMethod = (item) => {
    //删除
    if (item.grade === 1) {
      setDataSource(dataSource.filter((data) => data.id !== item.id));
      axios.delete(`/rights/${item.id}`).then((res) => {
        message.success(`删除成功！`);
      });
    } else {
      let list = dataSource.filter((data) => data.id === item.rightId);
      list[0].children = list[0].children.filter((data) => data.id !== item.id);
      setDataSource([...dataSource]);
      axios.delete(`/children/${item.id}`).then((res) => {
        message.success(`删除成功！`);
      });
    }
  };

  const switchMethod = (item) => {
    //修改权限
    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1;
    setDataSource([...dataSource]);
    if (item.grade === 1) {
      axios.patch(`/rights/${item.id}`, {
        pagepermisson: item.pagepermisson,
      });
    } else {
      axios.delete(`/children/${item.id}`, {
        pagepermisson: item.pagepermisson,
      });
    }
  };
  return (
    <div>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
}
