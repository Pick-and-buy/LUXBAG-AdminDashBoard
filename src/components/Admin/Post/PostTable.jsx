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
import { callFetchListPosts, callDeletePost } from "../../../services/post";

const PostTable = () => {
    const [listPosts, setListPosts] = useState([]);

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, [current, pageSize]);

    const fetchPosts = async () => {
        setIsLoading(true);
        const res = await callFetchListPosts();
        console.log('>>> check call get all Posts <Posts Table>: ', res);
        if (res && res.result) {
            setListPosts(res.result);
            setTotal(res.result.length);
        }
        setIsLoading(false);
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
                        //setDataViewDetail(record);
                        //setOpenViewDetail(true);
                    }}>
                        {record.id}
                    </a>
                )
            }
        },
        {
            title: 'Tiêu Đề Bài Đăng',
            align: 'center',
            dataIndex: 'title',
            sorter: (a, b) => a.title.length - b.title.length,
            filters: listPosts.map(post => ({
                text: post.title,
                value: post.title,
            })),
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => record.title.includes(value),
            render: (text, record, index) => {
                return (
                    <a href="#" onClick={() => {
                        //setDataViewDetail(record);
                        //setOpenViewDetail(true);
                    }}>
                        {record.title}
                    </a>
                )
            }
        },
        {
            title: 'Tên Sản Phẩm',
            align: 'center',
            dataIndex: 'productName',
            sorter: (a, b) => a?.product?.name.length - b?.product?.name.length,
            filters: listPosts.map(post => ({
                text: post?.product?.name,
                value: post?.product?.name,
            })),
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => record?.product?.name.includes(value),
            render: (text, record) => {
                return (
                    <div>
                        {record?.product?.name}
                    </div>
                )
            },
        },
        {
            title: 'Thương Hiệu',
            width: '10%',
            align: 'center',
            dataIndex: 'brandName',
            sorter: (a, b) => a?.product?.brand?.name.length - b?.product?.brand?.name.length,
            filters: listPosts.map(post => ({
                text: post?.product?.brand?.name,
                value: post?.product?.brand?.name,
            })),
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => record?.product?.brand?.name.includes(value),
            render: (text, record) => {
                return (
                    <div>
                        {record?.product?.brand?.name}
                    </div>
                )
            },
        },
        {
            title: 'Giá Sản Phẩm',
            width: '10%',
            align: 'center',
            dataIndex: 'price',
            sorter: (a, b) => a?.product?.price - b?.product?.price,
            render: (text, record) => {
                return (
                    <div>
                        {record?.product?.price}
                    </div>
                )
            },
        },
        {
            title: 'Màu Sắc',
            width: '10%',
            align: 'center',
            dataIndex: 'color',
            sorter: (a, b) => a?.product?.color - b?.product?.color,
            render: (text, record) => {
                return (
                    <div>
                        {record?.product?.color}
                    </div>
                )
            },
        },
        {
            title: 'Action',
            width: '10%',
            align: 'center',
            render: (text, record, index) => {
                return (
                    <>
                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận xóa thương hiệu"}
                            description={"Bạn có chắc chắn muốn xóa bài đăng này?"}
                            //onConfirm={() => handleDeletePost(record.id)}
                            onText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <DeleteTwoTone
                                twoToneColor={COLORS.primary}
                            />
                        </Popconfirm>
                        <EditTwoTone
                            twoToneColor={COLORS.primary}
                            style={{ cursor: "pointer", paddingLeft: 20 }}
                            onClick={() => {
                                //setOpenModalUpdate(true);
                                //setDataUpdate(record);
                            }}
                        />
                    </>
                )
            }
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
    }

    const renderHeader = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 20, fontFamily: 'bold', color: COLORS.primary }}>Table List Brand-Lines</span>
                {/* <span style={{ display: 'flex', gap: 10 }}>
                    <Button
                        icon={<PlusOutlined />}
                        type="primary" danger
                        onClick={() => setOpenModalCreate(true)}
                    >Thêm mới
                    </Button>
                </span> */}
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
                        dataSource={listPosts}
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
        </>
    )
}

export default PostTable;