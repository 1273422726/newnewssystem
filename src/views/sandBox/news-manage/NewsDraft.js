import React, { useState, useEffect } from "react";
import { Modal, Table, Button, message, notification } from "antd";
import axios from "axios";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  VerticalAlignTopOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
const { confirm } = Modal;

export default function NewsDraft() {
  const [dataSource, setDataSource] = useState([]);
  const { username } = JSON.parse(localStorage.getItem("token"));
  const navigator = useNavigate();
  useEffect(() => {
    //请求用户数据
    axios
      .get(`/news?author=${username}&auditState=0&_expand=category`)
      .then((res) => {
        const list = res.data;
        setDataSource(list);
      });
  }, [username]);
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id) => {
        return <b>{id}</b>;
      },
    },
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
        return category.title;
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
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => {
                navigator(`/news-manage/update/${item.id}`);
              }}
            />
            &nbsp; &nbsp; &nbsp;
            <Button
              type="primary"
              shape="circle"
              icon={<VerticalAlignTopOutlined />}
              onClick={() => handleCheck(item.id)}
            />
          </div>
        );
      },
    },
  ];

  const handleCheck = (id) => {
    axios
      .patch(`/news/${id}`, {
        auditState: 1,
      })
      .then((res) => {
         navigator("/audit-manage/list")
        notification.info({
          message: `通知`,
          description: `您可以到审核列表中查看您的新闻`,
          placement: "bottom",
        });
      });
  };
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
    setDataSource(dataSource.filter((data) => data.id !== item.id));
    axios.delete(`/news/${item.id}`).then((res) => {
      message.success(`删除成功！`);
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
