import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Tag, Button, notification } from "antd";

export default function AuditList() {
  const { username } = JSON.parse(localStorage.getItem("token"));
  const [dataSource, setDataSource] = useState([]);
  const navigator = useNavigate();
  useEffect(() => {
    axios(
      `/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`
    ).then((res) => {
      // console.log(res);
      setDataSource(res.data);
    }); //_ne=0   不等于0   ——lte=1  小于等于1
  }, [username]);

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
      title: "审核状态",
      dataIndex: "auditState",
      render: (auditState) => {
        const colorList = ["", "orange", "green", "red"];
        const auditList = ["草稿箱", "审核中", "已通过", "未通过"];
        return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>;
      },
    },
    {
      title: "操作",
      render: (item) => {
        return (
          <div>
            {item.auditState === 1 && (
              <Button type="primary" onClick={() => handleRervert(item)}>
                撤销
              </Button>
            )}
            {item.auditState === 2 && (
              <Button type="primary" onClick={() => handlePublish(item)}>
                发布
              </Button>
            )}
            {item.auditState === 3 && (
              <Button type="primary" onClick={() => handleUpdate(item)}>
                更新
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  const handleRervert = (item) => {
    //撤销
    setDataSource(dataSource.filter((data) => data.id !== item.id)); //筛选
    axios
      .patch(`/news/${item.id}`, {
        auditState: 0,
        publishTime: Date.now(),
      })
      .then((res) => {
        notification.info({
          message: `通知`,
          description: `您可以到草稿箱中查看您的新闻`,
          placement: "bottom",
        });
      });
  };

  const handleUpdate = (item) => {
    //更新
    navigator(`/news-manage/update/${item.id}`);
  };

  const handlePublish = (item) => {
    //发布
    axios
      .patch(`/news/${item.id}`, {
        publishState: 2,
      })
      .then((res) => {
        navigator("/publish-manage/published");
        notification.info({
          message: `通知`,
          description: `您可以到 发布管理/已发布 中查看您的新闻`,
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
