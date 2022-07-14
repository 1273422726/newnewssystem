import axios from "axios";
import { useEffect, useState } from "react";
import { notification } from "antd";

function usePublish(type) {
  const { username } = JSON.parse(localStorage.getItem("token")); //公共组件
  const [dataSource, setDataSource] = useState([]); //用户列表

  useEffect(() => {
    axios(
      `/news?author=${username}&publishState=${type}&_expand=category`
    ).then((res) => {
      setDataSource(res.data);
    });
  }, [username, type]);

  const handleSunset = (id) => {
    //下线
    setDataSource(dataSource.filter((data) => data.id !== id));
    axios.delete(`/news/${id}`).then((res) => {
      notification.info({
        message: `通知`,
        description: `您已经删除已下线的新闻`,
        placement: "bottom",
      });
    });
  };
  const handleUnpublished = (id) => {
    //待发布
    setDataSource(dataSource.filter((data) => data.id !== id));
    axios
      .patch(`/news/${id}`, {
        publishState: 2,
        publishTime: Date.now(),
      })
      .then((res) => {
        notification.info({
          message: `通知`,
          description: `您可以到[发布管理/已发布]中查看您的新闻`,
          placement: "bottom",
        });
      });
  };
  const handlePublished = (id) => {
    //已发布
    setDataSource(dataSource.filter((data) => data.id !== id));
    axios
      .patch(`/news/${id}`, {
        publishState: 3,
        publishTime: Date.now(),
      })
      .then((res) => {
        notification.info({
          message: `通知`,
          description: `您可以到[发布管理/已下线]中查看您的新闻`,
          placement: "bottom",
        });
      });
  };
  return {
    dataSource,
    handleSunset,
    handleUnpublished,
    handlePublished,
  };
}
export default usePublish;
