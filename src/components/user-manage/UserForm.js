import React, { forwardRef, useEffect, useState } from 'react'
import { Form, Input, Select } from 'antd';
const { Option } = Select;

const UserForm = forwardRef((props, ref) => {
    const [isDisabled, setisDisabled] = useState(false)
    useEffect(() => {
        setisDisabled(props.isUpadteDisabled)
    }, [props.isUpadteDisabled])

    const { roleId, region } = JSON.parse(localStorage.getItem('token'));   //获取用户数据

    const checkIsDisabled = (item) => {
        if (props.isUpdate) {           //判断用户区域权限
            if (roleId === 1) {
                return false;
            } else {
                return true;
            }
        } else {
            if (roleId === 1) {
                return false;
            } else {
                return item.value !== region;
            }
        }
    }

    const checkRoleIsDisabled = (item) => {
        if (props.isUpdate) {           //判断用户角色权限
            if (roleId === 1) {
                return false;
            } else {
                return true;
            }
        } else {
            if (roleId === 1) {
                return false;
            } else {
                // if (item.id === 2) {
                //     return false;
                // } else {
                //     return true;
                // }
                return item.id !== 3
            }
        }
    }
    return (
        <Form
            ref={ref}
            layout="vertical"
            initialValues={{
                modifier: 'public',
            }}
        >
            <Form.Item
                name="username"
                label="用户"
                rules={[
                    {
                        required: true,
                        message: '请输入用户名！',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item name="password" label="密码"
                rules={[
                    {
                        required: true,
                        message: '请输入密码！',
                    },
                ]}>
                <Input.Password />
            </Form.Item>
            <Form.Item
                name="region"
                label="区域"
                rules={isDisabled ? [] : [{ required: true, message: 'Please input the title of collection!' }]}
            >
                <Select disabled={isDisabled}>
                    {
                        props.regionList.map(item =>
                            <Option disabled={checkIsDisabled(item)} value={item.value} key={item.id}>{item.title}</Option>
                        )
                    }
                </Select>
            </Form.Item>
            <Form.Item name="roleId" label="角色" rules={[{ required: true, message: 'Please input the title of collection!' }]}>
                <Select onChange={(value) => {
                    if (value === 1) {
                        setisDisabled(true) //改变状态
                        ref.current.setFieldsValue({     //通过ref改变region区域输入框中的内容
                            region: ""
                        })
                    } else {
                        setisDisabled(false)
                    }
                }}>
                    {
                        props.roleList.map(item =>
                            <Option value={item.id} key={item.id} disabled={checkRoleIsDisabled(item)}>{item.roleName}</Option>
                        )
                    }
                </Select>
            </Form.Item>
        </Form>
    )
})

export default UserForm;