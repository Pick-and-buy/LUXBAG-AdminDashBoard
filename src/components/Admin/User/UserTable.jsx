import React, { useState, useEffect } from "react";
import { Table, Row, Col, Button } from "antd";
import { Drawer, Descriptions, Popconfirm, message, notification } from "antd";
import {
    CloudUploadOutlined,
    DeleteTwoTone,
    EditTwoTone,
    ExportOutlined,
    PlusOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import { COLORS } from "../../../constants/theme";
import moment from "moment/moment";
import { callFetchListUser } from "../../../services/user";
import UserViewDetail from "./UserViewDetail";

const UserTable = () => {
    const [originalListUser, setOriginalListUser] = useState([]);
    const [listUser, setListUser] = useState([]);

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);

    const [isLoading, setIsLoading] = useState(false);

    const [dataViewDetail, setDataViewDetail] = useState("");
    const [openViewDetail, setOpenViewDetail] = useState(false);

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        setIsLoading(true);
        const res = await callFetchListUser();
        console.log('>>> check res user: ', res);
        if (res && res.result) {
            setOriginalListUser(res.result)
            setListUser(res.result);
            setTotal(res.result.length);
        }
        setIsLoading(false);
    }

    // Get unique years and months
    const years = [...new Set(listUser.map(item =>
        moment(item.dob).year()
    ))];
    const months = [...new Set(listUser.map(item =>
        moment(item.dob).format('MM')
    ))];

    const getUniqueFilterValues = (listUser, keyPath) => {
        const values = listUser.map(user => keyPath.reduce((acc, key) => acc?.[key], user)).filter(Boolean);
        return [...new Set(values)].map(value => ({ text: value, value }));
    }

    const columns = [
        {
            title: 'Id',
            width: '10%',
            align: 'center',
            dataIndex: 'id',
            ellipsis: true,
            render: (text, record, index) => {
                return (
                    <a href="#" onClick={() => {
                        setDataViewDetail(record);
                        setOpenViewDetail(true);
                    }}>
                        {index + 1}
                    </a>
                )
            }
        },
        {
            title: 'Tên Đăng Nhập',
            align: 'center',
            dataIndex: 'username',
            filters: originalListUser.map(user => ({
                text: user.username,
                value: user.username,
            })),
            filterMode: 'tree',
            filterSearch: true,
            //onFilter: (value, record) => record.username.includes(value),
            render: (text, record, index) => {
                return (
                    <a href="#" onClick={() => {
                        setDataViewDetail(record);
                        setOpenViewDetail(true);
                    }}>
                        {record.username}
                    </a>
                )
            }
        },
        {
            title: 'Role',
            align: 'center',
            dataIndex: 'roleName',
            filters: getUniqueFilterValues(originalListUser, ['roles', '0', 'name']),
            filterMode: 'tree',
            filterSearch: true,
            //onFilter: (value, record) => record?.roles[0]?.name.includes(value),
            render: (text, record) => {
                return (
                    <div>
                        {record?.roles[0].name}
                    </div>
                )
            },
        },
        {
            title: 'Email',
            align: 'center',
            dataIndex: 'email',
        },
        {
            title: 'Số Điện Thoại',
            align: 'center',
            dataIndex: 'phoneNumber',
        },
        {
            title: 'Ngày Sinh',
            align: 'center',
            dataIndex: 'dob',
            render: (text, record, index) => {
                return (
                    <div>
                        {moment(record.dob).format("DD-MM-YYYY")}
                    </div>
                )
            },
        },
    ];

    const onChange = (pagination, filters, sorter, extra) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1)
        }

        let filteredData = [...originalListUser];

        //Filter by username
        if(filters.username) {
            filteredData = filteredData.filter(item => filters.username.includes(item?.username))
        }

        if(filters.roleName) {
            filteredData = filteredData.filter(item => filters.roleName.includes(item?.roles[0].name))
        }

        setListUser(filteredData);
        setTotal(filteredData.length);
    }

    const renderHeader = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 20, fontFamily: 'bold', color: COLORS.primary }}>Table List User</span>
            </div>
        )
    }

    return (
        <>
            <Row>
                <Col span={24}>
                    <Table
                        title={renderHeader}
                        loading={isLoading}
                        columns={columns}
                        dataSource={listUser}
                        onChange={onChange}
                        rowKey="id"
                        pagination={
                            {
                                current: current,
                                pageSize: pageSize,
                                total: total,
                                showSizeChanger: true,
                                //showTotal: To display the total number and range
                                showTotal: (total, range) => {
                                    return (
                                        <div>
                                            {range[0]} - {range[1]} trên {total} rows
                                        </div>
                                    )
                                }
                            }
                        }
                    />
                </Col>
            </Row>
            <UserViewDetail
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
            />
        </>
    )
}

export default UserTable;