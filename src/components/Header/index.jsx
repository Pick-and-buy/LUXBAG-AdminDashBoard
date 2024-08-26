import React, { useState } from 'react';
import { FaReact } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { VscSearchFuzzy } from "react-icons/vsc";
import { Divider, Badge, Drawer, message, Avatar, Button, Layout, Menu, Dropdown, Space, Input } from 'antd';
import './header.scss';
import { useDispatch, useSelector } from 'react-redux';
import { DownOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { callLogout } from '../../services/auth';
import { doLogoutAction } from '../../redux/account/accountSlice';

const { Search } = Input;

const Header = (props) => {
    const { searchQuery, setSearchQuery } = props;

    const [openDrawer, setOpenDrawer] = useState(false);
    const isAuthenticated = useSelector(state => state.account.isAuthenticated);
    const user = useSelector(state => state.account.user);
    const userRole = user.roles[0].name;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = async () => {
        const res = await callLogout();
        dispatch(doLogoutAction());
        message.success("Đăng xuất thành công");
        navigate("/login")
    }

    let items = [
        // {
        //     label: <label
        //         style={{ cursor: 'pointer' }}
        //     >Quản Lý Tài Khoản</label>,
        //     key: 'account',
        // },
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => handleLogout()}
            >Đăng Xuất</label>,
            key: 'logout',
        },
    ];

    if (userRole === 'ADMIN') {
        items.unshift({
            label: <Link to='/admin'>Trang quản trị</Link>,
            key: 'admin',
        })
    }

    const handleRedirectHomPage = () => {
        navigate('/');
    }

    const handleInputChange = (e) => {
        // let query = e.target.value;
        // setSearchQuery(query);
        console.log('>>> check value search query: ', e.target.value);
    };

    return (
        <>
            <div className='header-container'>
                <header className='page-header'>
                    <div className='page-header_top'>
                        <div className='page-header_toggle' onClick={() => {
                            setOpenDrawer(true)
                        }}>OPEN</div>
                        <div className='page-header_logo'>
                            <span className='logo' onClick={() => handleRedirectHomPage()}>
                                <FaReact className='rotate icon-react'>ABC DEF</FaReact>
                                <VscSearchFuzzy className='icon-search' />
                            </span>
                            <input
                                className='input-search'
                                type={'text'}
                                placeholder="Bạn Tìm gì hôm nay"
                                value={searchQuery}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <nav className='page-header_bottom'>
                        <ul id="navigation" className='navigation'>
                            <li className='navigation_item mobile'><Divider type='vertical' /></li>
                            <li className='navigation_item mobile'><Divider type='vertical' /></li>
                            <li className='navigation_item mobile'><Divider type='vertical' /></li>
                            <li className='navigation_item mobile'><Divider type='vertical' /></li>
                            <li className='navigation_item mobile'><Divider type='vertical' /></li>
                            <li className='navigation_item mobile'><Divider type='vertical' /></li>
                            <li className='navigation_item mobile'><Divider type='vertical' /></li>
                            <li className='navigation_item mobile'><Divider type='vertical' /></li>
                            <li className='navigation_item mobile'><Divider type='vertical' /></li>
                            <li className='navigation_item mobile'>
                                {isAuthenticated === true ?
                                    <Dropdown menu={{ items }} trigger={['click']}>
                                        <a onClick={(e) => e.preventDefault()}>
                                            <Space>
                                                <Avatar src={user?.avatar} />
                                                {user?.username}
                                                <DownOutlined />
                                            </Space>
                                        </a>
                                    </Dropdown>
                                    :
                                    <span onClick={() => navigate('/login')}>Tài Khoản</span>
                                }
                            </li>
                        </ul>
                    </nav>
                </header>
            </div>
            <Drawer
                title="Menu Chức Năng"
                placement='left'
                onClose={() => setOpenDrawer(false)}
                open={openDrawer}
            >
                <p>Quản lý tài khoản</p>
                <Divider />

                <p>Đăng xuất</p>
                <Divider />
            </Drawer>
        </>
    )
}

export default Header;