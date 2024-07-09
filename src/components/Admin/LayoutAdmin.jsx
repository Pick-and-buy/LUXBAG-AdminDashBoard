import React, { Children, useState } from 'react';
import {
    AppstoreOutlined,
    ExceptionOutlined,
    HeartTwoTone,
    TeamOutlined,
    UserOutlined,
    DollarCircleOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DownOutlined,
    BlockOutlined,
    PaperClipOutlined,
    FileProtectOutlined,
    ContactsOutlined,
    FileTextOutlined,
    ReadOutlined,
    ProfileOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, Avatar, Dropdown, Space, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from "react-router-dom";
import { COLORS } from '../../constants/theme';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './layout.scss';
import { doLogoutAction } from '../../redux/account/accountSlice';
import { callLogout } from '../../services/auth';
const { Header, Content, Footer, Sider } = Layout;

const items = [
    {
        label: <Link to='/admin'>Dashboard</Link>,
        key: 'dashboard',
        icon: <AppstoreOutlined />,
    },
    {
        label: <Link to='/admin/user'>Manage Users</Link>,
        key: 'user',
        icon: <UserOutlined />,
    },
    {
        label: <span>Manage Brands</span>,
        icon: <BlockOutlined />,
        children: [
            {
                label: <Link to='/admin/brands'>Brand</Link>,
                key: 'brands',
                icon: <FileTextOutlined />,
            },
            {
                label: <Link to='/admin/brandLines'>Brand Lines</Link>,
                key: 'brandLines',
                icon: <ContactsOutlined />,
            }

        ]
    },
    {
        label: <Link to='/admin/category'>Manage Categories</Link>,
        key: 'category',
        icon: <ProfileOutlined />,
    },
    {
        label: <Link to='/admin/news'>Manage News</Link>,
        key: 'news',
        icon: <ReadOutlined />,
    },
    {
        label: <Link to='/admin/posts'>Manage Posts</Link>,
        key: 'posts',
        icon: <FileProtectOutlined />,
    },
];



const LayoutAdmin = () => {

    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const user = useSelector(state => state.account.user);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = async () => {
        const res = await callLogout();
        console.log('check res logout admin: ', res);
        dispatch(doLogoutAction());
        message.success("Đăng xuất thành công");
        navigate("/login")
    }

    const handleHomePage = () => {
        navigate("/")
    }

    const itemsDropdowrn = [
        {
            label: <label style={{ cursor: 'pointer' }}> Quản Lý Tài Khoản </label>,
            key: 'account',
        },
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => handleHomePage()}
            >Trang Chủ</label>,
            key: 'homepage',
        },
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => handleLogout()}
            >Đăng Xuất</label>,
            key: 'logout',
        },
    ];

    return (
        <Layout
            style={{ minHeight: '100vh' }}
            className='layout-admin'
        >
            <Sider
                theme='dark'
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
            >
                <div style={{ height: 32, margin: 16, textAlign: 'center', color: COLORS.white }}>
                    Admin
                </div>
                <Menu
                    defaultSelectedKeys={[activeMenu]}
                    mode="inline"
                    theme="dark"
                    items={items}
                    onClick={(e) => setActiveMenu(e.key)}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, backgroundColor: COLORS.white, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{ fontSize: '16px', width: 64, height: 64 }}
                    />
                    <Dropdown menu={{ items: itemsDropdowrn }} trigger={['click']}>
                        <a style={{ cursor: 'pointer', marginRight: 40 }}>
                            <Space>
                                <Avatar src={user?.avatar} />
                                {user?.username}
                                <DownOutlined />
                            </Space>
                        </a>
                    </Dropdown>
                </Header>
                <Content>
                    <Outlet />   {/* Children */}
                </Content>
                <Footer style={{ textAlign: 'center', padding: 0, backgroundColor: COLORS.white }}>
                    Giá Tốt ©{new Date().getFullYear()}
                </Footer>
            </Layout>
        </Layout>
    )
}

export default LayoutAdmin;