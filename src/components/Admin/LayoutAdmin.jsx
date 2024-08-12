import React, { Children, useEffect, useState } from 'react';
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
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './layout.scss';
import { doLogoutAction } from '../../redux/account/accountSlice';
import { callLogout } from '../../services/auth';
import { AiFillDollarCircle } from "react-icons/ai";
import { SiBrandfolder } from "react-icons/si";
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
                icon: <SiBrandfolder />,
            },
            {
                label: <Link to='/admin/brandLines'>Brand Lines</Link>,
                key: 'brandLines',
                icon: <FileTextOutlined />,
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
    {
        label: <Link to='/admin/transactions'>Manage Transaction</Link>,
        key: 'transactions',
        icon: <AiFillDollarCircle />,
    },
];



const LayoutAdmin = () => {
    // Inside LayoutAdmin component
    const location = useLocation();

    //Get current path
    const currentPath = location.pathname;

    // Khởi tạo activeMenu dựa trên đường dẫn hiện tại
    const initialMenu = () => {
        const matchingItem = items.find(item => {
            if (item.children) {
                return item.children.some(child => child.key === currentPath.split('/').pop());
            }
            return currentPath.includes(item.key);
        });
        return matchingItem ? matchingItem.key : 'dashboard';
    };

    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState(initialMenu());
    const user = useSelector(state => state.account.user);

    const navigate = useNavigate();
    const dispatch = useDispatch();


    //handle active Menu when change url
    useEffect(() => {
        //Duyệt qua từng item trong mảng items
        //Khi tìm thấy item thỏa mãn điều kiện trong hàm find, nó sẽ trả về item đó và lưu trữ trong biến matchingItem.
        const matchingItem = items.find(item => {
            if (item.children) {
                return item.children.some(child => child.key === currentPath.split('/').pop());
            }
            //Trả về true nếu item.key là một phần của currentPath.
            return currentPath.includes(item.key);
        });

        if (matchingItem) {
            setActiveMenu(matchingItem.key);
        }
        console.log('>>> check matchingItem: ', matchingItem);
        
    }, [location, activeMenu])

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
                    selectedKeys={[activeMenu]}
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