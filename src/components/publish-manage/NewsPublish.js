import React from "react";
import { Table } from "antd";

export default function NewsPublish(prpos) {
  const { dataSource, button } = prpos;
  const columns = [
    {
      title: "新闻标题",
      dataIndex: "title",
      render: (title, item) => {
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>;
      },
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
        return <div>{button(item.id)}</div>;
      },
    },
  ];

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
