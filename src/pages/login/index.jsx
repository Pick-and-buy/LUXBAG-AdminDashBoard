import React, { useState } from 'react';
import { Button, Row, Col, Divider, Form, Input, message, notification } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { callLogin } from '../../services/auth.js';
import { getUserByToken } from '../../services/user.js';
import { useDispatch } from 'react-redux';
import { doLoginAction } from '../../redux/account/accountSlice';
import Sky from '../../assets/images/sky.png';
import GiaTot_Logo from '../../assets/images/GiaTot_Logo.png';
import './login.scss';
import { COLORS } from '../../constants/theme';

const styleForm = {
    // maxWidth: 600, 
    paddingTop: '30px',
    margin: 'auto',
    width: '60%',
    // border: '2px solid blue',
}

const Login = () => {
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const dispatch = useDispatch();

    const fetchUserData = async () => {
        try {
            const userData = await getUserByToken();
            console.log('>> check get user: ', userData);
            dispatch(doLoginAction(userData.result))

        } catch (error) {
            console.error('Fetching user data failed:', error);
        }
    };

    const onFinish = async (values) => {
        try {
            const { phoneNumber, password } = values;
            setIsSubmit(true);
            const res = await callLogin(phoneNumber, password);
            setIsSubmit(false);
            console.log('>>>check data <Login>: ', res);
            localStorage.setItem('accessToken', res.result.accessToken);

            fetchUserData();

            message.success('Đăng nhập tài khoản thành công!');
            // navigate('/')
        } catch (error) {
            setIsSubmit(false);
            notification.error({
                message: 'Có lỗi xảy ra',
                description: 'Thông tin đăng nhập không chính xác',
            })
        }

    };


    return (
        <div className='login-container'>
            <div className='login-page'>
                <h1 style={{ textAlign: 'center', color: COLORS.primary }}>Đăng Nhập</h1>
                <Divider />
                <Form
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    style={styleForm}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    autoComplete="off"
                >

                    <Row gutter={12}>
                        <Col span={24}>
                            <Form.Item
                                // labelCol={{ span: 24 }}
                                label="Số điện thoại"
                                name="phoneNumber"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập số điện thoại của bạn!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={12}>
                        <Col span={24}>
                            <Form.Item
                                // labelCol={{ span: 24 }}
                                label="Mật khẩu"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Hãy nhập mật khẩu của bạn!',
                                    },
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Button type="primary" danger htmlType="submit" loading={isSubmit}>
                            Đăng Nhập
                        </Button>
                    </Form.Item>
                </Form>

            </div>
            <div className='login-logo'>
                <img style={{ width: "100%", height: "200px" }} src={Sky} />
                <img style={{ marginTop: '-130px', width: "500px", height: "500px", margin: 'auto' }} src={GiaTot_Logo} />
            </div>
        </div>
    )
}

export default Login;