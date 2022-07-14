import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table, Button, notification } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

export default function Audit() {
  const [dataSource, setDataSource] = useState([]); //用户列表
  const { roleId, region, username } = JSON.parse(
    localStorage.getItem("token")
  ); //获取用户数据

  useEffect(() => {
    const roleObj = {
      1: "superadmin",
      2: "admin",
      3: "editor",
    };
    axios.get(`/news?auditState=1&_expand=category`).then((res) => {
      const list = res.data;
      setDataSource(
        roleObj[roleId] === "superadmin"
          ? list
          : [
              ...list.filter((item) => item.author === username),
              ...list.filter(
                (item) =>
                  item.region === region && roleObj[item.roleId] === "editor"
              ),
            ]
      );
    });
  }, [roleId, region, username]);

  const columns = [
    {
      title: "新闻标题",
      dataIndex: "title",
      render: (title, item) => {
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>;
      },
    },
    {
      title: "作者",
      dataIndex: "author",
    },
    {
      title: "新闻分类",
      dataIndex: "category",
      render: (category) => {
        return <div>{category.title}</div>;
      },
    },
    {
      title: "操作",
      render: (item) => {
        return (
          <div>
            <Button
              type="primary"
              shape="circle"
              icon={<CheckOutlined />}
              onClick={() => handleAudit(item, 2, 1)}
            />
            &nbsp;&nbsp;&nbsp;
            <Button
              type="primary"
              shape="circle"
              danger
              icon={<CloseOutlined />}
              onClick={() => handleAudit(item, 3, 0)}
            />
          </div>
        );
      },
    },
  ];

  const handleAudit = (item, auditState, publishState) => {
    setDataSource(dataSource.filter((data) => data.id !== item.id));
    axios
      .patch(`/news/${item.id}`, {
        auditState,
        publishState,
      })
      .then((res) => {
        notification.info({
          message: `通知`,
          description: `您可以到[审核管理/审核列表]中查看您的新闻的审核状态`,
          placement: "bottom",
        });
      });
  };
  return (
    <div>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={{ pageSize: 5 }}
        rowKey={(item) => item.id}
      />
    </div>
  );
}
