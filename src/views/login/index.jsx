import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input,message } from 'antd';
import '../../assets/css/login/index.css'
import React from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigator = useNavigate();
  const onFinish = (values) => {
    axios.get(`/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`).then((res) => {
      if(res.data.length===0){
        message.error("没有此用户！")
      }else{
        localStorage.setItem("token",JSON.stringify(res.data[0]));
        navigator('/')
        message.success("登录成功！")
      }
    })
  };

  return (
    <div style={{ background: 'rgb(35,39,65)', height: '100%' }}>
      <div className='login'>
        <div className="loginTitle">全球新闻发布系统</div>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your Username!',
              },
            ]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <a className="login-form-forgot" href="">
              Forgot password
            </a>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
export default Login