import React, { useEffect, useState, useRef } from "react";
import { Table, Button, message, Modal, Switch } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import UserForm from "../../../components/user-manage/UserForm";
import axios from "axios";
const { confirm } = Modal;

export default function UserList() {
  const [isAddVisible, setIsAddVisible] = useState(false); //添加用户弹窗
  const [dataSource, setDataSource] = useState([]); //用户列表
  const [regionList, setRegionList] = useState([]); //角色数据
  const [roleList, setRoleList] = useState([]); //区域数据
  const [isUpadteVisible, setIsUpadteVisible] = useState(false); //更新用户
  const [isUpadteDisabled, setIsUpadteDisabled] = useState(false); //更新用户状态值
  const [current, setCurrent] = useState(null); //更新用户状态值

  const addFrom = useRef(null); //useRef
  const upadteFrom = useRef(null); //useRef
  const { roleId, region, username } = JSON.parse(
    localStorage.getItem("token")
  ); //获取用户数据

  useEffect(() => {
    //请求用户列表数据
    const roleObj = {
      1: "superadmin",
      2: "admin",
      3: "editor",
    };
    axios.get(`/users?_expand=role`).then((res) => {
      const list = res.data;
      setDataSource(
        roleObj[roleId] === "superadmin"
          ? list
          : [
              ...list.filter((item) => item.username === username),
              ...list.filter(
                (item) =>
                  item.region === region && roleObj[item.roleId] === "editor"
              ),
            ]
      );
    });
  }, [roleId, region, username]);

  useEffect(() => {
    //请求添加用户角色数据
    axios.get(`/regions`).then((res) => {
      const list = res.data;
      setRegionList(list);
      // console.log('角色', list)
    });
  }, []);

  useEffect(() => {
    //请求添加用户区域数据
    axios.get(`/roles`).then((res) => {
      const list = res.data;
      setRoleList(list);
      // console.log('区域', list)
    });
  }, []);

  const columns = [
    {
      title: "区域",
      dataIndex: "region",
      filters: [
        ...regionList.map((item) => ({
          text: item.title,
          value: item.value,
        })),
        {
          text: "全球",
          value: "全球",
        },
      ],
      onFilter: (value, item) => {
        //筛选
        if (value === "全球") {
          return item.region === "";
        }
        return item.region === value;
      },
      render: (region) => {
        return <b>{region === "" ? "全球" : region}</b>;
      },
    },
    {
      title: "角色名称",
      dataIndex: "role",
      render: (role) => {
        return role.roleName;
      },
    },
    {
      title: "用户名",
      dataIndex: "username",
      render: (username) => {
        return username;
      },
    },
    {
      title: "用户状态",
      dataIndex: "roleState",
      render: (roleState, item) => {
        return (
          <Switch
            checked={roleState}
            disabled={item.default}
            onChange={() => handleChange(item)}
          ></Switch>
        );
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
              disabled={item.default}
            ></Button>
            &nbsp; &nbsp; &nbsp;
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => handleUpdate(item)}
              disabled={item.default}
            />
          </div>
        );
      },
    },
  ];
  const confirmMethod = (item) => {
    //删除提示框
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
    axios.delete(`/users/${item.id}`).then((res) => {
      message.success(`删除成功！`);
    });
  };

  const addFromOk = () => {
    //添加用户确认
    addFrom.current
      .validateFields()
      .then((value) => {
        //返回一个json 对象，进行验证
        // console.log(value)
        setIsAddVisible(false);
        addFrom.current.resetFields();
        //post 到后端，生成id 在设置dataSource 方便后面删除修改
        axios
          .post(`/users`, {
            ...value,
            roleState: true,
            default: false,
          })
          .then((res) => {
            console.log(res.data);
            setDataSource([
              ...dataSource,
              {
                ...res.data,
                role: roleList.filter((item) => item.id === value.roleId)[0],
              },
            ]);
            message.success("添加用户成功");
          });
      })
      .catch((err) => {
        message.error(err);
      });
  };

  const handleChange = (item) => {
    //用户状态
    item.roleState = !item.roleState;
    setDataSource([...dataSource]);
    axios.patch(`/users/${item.id}`, {
      roleState: item.roleState,
    });
  };

  const upadteFromOk = (item) => {
    //更新用户信息
    upadteFrom.current
      .validateFields()
      .then((value) => {
        setIsUpadteVisible(false);
        setDataSource(
          dataSource.map((item) => {
            if (item.id === current.id) {
              return {
                ...item,
                ...value,
                role: roleList.filter((data) => data.id === value.roleId)[0],
              };
            }
            return item;
          })
        );
        setIsUpadteDisabled(!isUpadteDisabled);
        axios.patch(`/users/${current.id}`, value).then((res) => {
          if (res.status === 200) {
            message.success("更新用户信息成功");
          } else {
            message.error(res.message);
          }
        });
      })
      .catch((err) => {
        message.error(err);
      });
  };

  const handleUpdate = (item) => {
    //同步加载
    setTimeout(() => {
      setIsUpadteVisible(true);
      if (item.roleId === 1) {
        //禁用
        setIsUpadteDisabled(true);
      } else {
        //取消禁用
        setIsUpadteDisabled(false);
      }
      upadteFrom.current.setFieldsValue(item);
    }, 0);
    setCurrent(item);
  };
  return (
    <div>
      <Button
        type="primary"
        size="large"
        onClick={() => {
          setIsAddVisible(true);
        }}
      >
        添加用户
      </Button>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={{ pageSize: 5 }}
        rowKey={(item) => item.id}
      />{" "}
      {/**rowKey 当表没有key值，提供给表一个key值 */}
      <Modal
        visible={isAddVisible}
        title="添加用户信息"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          setIsAddVisible(false);
        }}
        onOk={() => {
          // console.log('add', addFrom)
          addFromOk();
        }}
      >
        <UserForm ref={addFrom} regionList={regionList} roleList={roleList} />
      </Modal>
      <Modal
        visible={isUpadteVisible}
        title="修改用户信息"
        okText="更新"
        cancelText="取消"
        onCancel={() => {
          setIsUpadteVisible(false);
          setIsUpadteDisabled(!isUpadteDisabled);
        }}
        onOk={() => {
          // console.log('add', addFrom)
          upadteFromOk();
        }}
      >
        <UserForm
          ref={upadteFrom}
          regionList={regionList}
          roleList={roleList}
          isUpadteDisabled={isUpadteDisabled}
          isUpdate={true}
        />
      </Modal>
    </div>
  );
}
