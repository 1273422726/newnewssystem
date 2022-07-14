import React, { useState, useEffect, useRef } from "react";
import {
  PageHeader,
  Steps,
  Button,
  Form,
  Input,
  Select,
  message,
  notification,
} from "antd";
import "./news_manage.css";
import axios from "axios";
import NewsEditor from "../../../components/news-manage/NewsWangeditor";
import { useNavigate } from "react-router-dom";
const { Step } = Steps;
const { Option } = Select;

export default function NewsAdd() {
  const [current, setCurrent] = useState(0);
  const [categoryList, setCategoryList] = useState([]);
  const [fromInfo, setFromInfo] = useState({});
  const [content, setContent] = useState("");
  const navigator = useNavigate();

  const NewsForm = useRef(null);
  const Users = JSON.parse(localStorage.getItem("token"));
  const handleNext = () => {
    if (current === 0) {
      NewsForm.current
        .validateFields()
        .then((res) => {
          setFromInfo(res);
          setCurrent(current + 1);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      if (content === "" || content.trim() === "<p></p>") {
        message.error("内容不能为空！");
      } else {
        setCurrent(current + 1);
      }
    }
  };
  const handlePrevious = () => {
    setCurrent(current - 1);
  };

  useEffect(() => {
    axios.get("/categories").then((res) => {
      // console.log(res.data)
      setCategoryList(res.data);
    });
  }, []);

  const handleSave = (auditState) => {
    axios
      .post(`/news`, {
        ...fromInfo,
        content: content,
        region: Users.region ? Users.region : "全球",
        author: Users.username,
        roleId: Users.roleId,
        auditState: auditState,
        publishState: 0,
        createTime: Date.now(),
        star: 0,
        view: 0,
        // publishTime: 0,
      })
      .then((res) => {
        auditState === 0
          ? navigator("/news-manage/draft")
          : navigator("/audit-manage/list");

        notification.info({
          message: `通知`,
          description: `您可以到${
            auditState === 0 ? "草稿箱" : "审核列表"
          }中查看您的新闻`,
          placement: "bottom",
        });
      });
  };
  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="撰写新闻"
        subTitle="This is a subtitle"
      />
      <Steps current={current}>
        <Step title="基本信息" description="新闻标题，新闻分类" />
        <Step title="新闻内容" description="新闻主体内容" />
        <Step title="新闻提交" description="保存草稿或者提交审核" />
      </Steps>
      <div style={{ marginTop: "50px" }}>
        <div className={current === 0 ? "" : "active"}>
          <Form
            name="basic"
            ref={NewsForm}
            labelCol={{
              span: 1.5,
            }}
            wrapperCol={{
              span: 22.5,
            }}
          >
            <Form.Item
              label="新闻标题"
              name="title"
              style={{ width: "100%" }}
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="新闻分类"
              name="categoryId"
              style={{ width: "100%" }}
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Select>
                {categoryList.map((item) => (
                  <Option value={item.id} key={item.id}>
                    {item.title}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </div>

        <div className={current === 1 ? "" : "active"}>
          <NewsEditor
            getContent={(value) => {
              setContent(value);
            }}
          ></NewsEditor>
        </div>
        <div className={current === 2 ? "" : "active"}></div>
      </div>
      <div style={{ marginTop: "50px" }}>
        {current === 2 && (
          <span>
            <Button type="primary" onClick={() => handleSave(0)}>
              保存草稿箱
            </Button>{" "}
            &nbsp;&nbsp;
            <Button danger onClick={() => handleSave(1)}>
              提交审核
            </Button>
          </span>
        )}
        {current < 2 && (
          <Button type="primary" onClick={handleNext}>
            下一步
          </Button>
        )}
        {current > 0 && (
          <Button style={{ marginLeft: "20px" }} onClick={handlePrevious}>
            上一步
          </Button>
        )}
      </div>
    </div>
  );
}
