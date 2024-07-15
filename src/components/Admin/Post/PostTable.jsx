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
import PostViewDetail from "./PostViewDetail";

const PostTable = () => {
    const [listPosts, setListPosts] = useState([]);

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);

    const [isLoading, setIsLoading] = useState(false);

    const [dataViewDetail, setDataViewDetail] = useState("");
    const [openViewDetail, setOpenViewDetail] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, [current, pageSize]);

    const fetchPosts = async () => {
        setIsLoading(true);
        const res = await callFetchListPosts();
        console.log('>>> check res post: ', res);
        if (res && res.result) {
            setListPosts(res.result);
            setTotal(res.result.length);
        }
        setIsLoading(false);
    }

    const getUniqueFilterValues = (posts, keyPath) => {
        const values = posts.map(post => keyPath.reduce((acc, key) => acc?.[key], post)).filter(Boolean);
        return [...new Set(values)].map(value => ({ text: value, value }));
    }

    const columns = [
        {
            title: 'STT',
            width: '10%',
            align: 'center',
            dataIndex: 'id',
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
            title: 'Tiêu Đề Bài Đăng',
            width: '20%',
            align: 'center',
            dataIndex: 'title',
            ellipsis: true,
            sorter: (a, b) => a.title.length - b.title.length,
            filters: getUniqueFilterValues(listPosts, ['title',]),
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => record.title.includes(value),
            render: (text, record, index) => {
                return (
                    <a href="#" onClick={() => {
                        setDataViewDetail(record);
                        setOpenViewDetail(true);
                    }}>
                        {record.title}
                    </a>
                )
            }
        },
        {
            title: 'Tên Sản Phẩm',
            width: '20%',
            align: 'center',
            dataIndex: 'productName',
            filters: getUniqueFilterValues(listPosts, ['product', 'name']),
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
            title: 'Người Đăng Bài',
            width: '10%',
            align: 'center',
            dataIndex: 'username',
            filters: getUniqueFilterValues(listPosts, ['user', 'username']),
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => record?.user?.username.includes(value),
            render: (text, record) => {
                return (
                    <div>
                        {record?.user?.username}
                    </div>
                )
            },
        },
        {
            title: 'Thương Hiệu',
            width: '10%',
            align: 'center',
            dataIndex: 'brandName',
            filters: getUniqueFilterValues(listPosts, ['product', 'brand', 'name']),
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
        // {
        //     title: 'Action',
        //     width: '10%',
        //     align: 'center',
        //     render: (text, record, index) => {
        //         return (
        //             <>
        //                 <Popconfirm
        //                     placement="leftTop"
        //                     title={"Xác nhận xóa thương hiệu"}
        //                     description={"Bạn có chắc chắn muốn xóa bài đăng này?"}
        //                     onConfirm={() => handleDeletePost(record.id)}
        //                     onText="Xác nhận"
        //                     cancelText="Hủy"
        //                 >
        //                     <DeleteTwoTone
        //                         twoToneColor={COLORS.primary}
        //                     />
        //                 </Popconfirm>
        //                 <EditTwoTone
        //                     twoToneColor={COLORS.primary}
        //                     style={{ cursor: "pointer", paddingLeft: 20 }}
        //                     onClick={() => {
        //                         //setOpenModalUpdate(true);
        //                         //setDataUpdate(record);
        //                     }}
        //                 />
        //             </>
        //         )
        //     }
        // },
    ];

    const handleDeletePost = async (postId) => {
        let query = `postId=${postId}`;
        const res = await callDeletePost(query);
        console.log('>>> check res DELETE Post: ', res);
        message.success('Xóa dòng bài đăng thành công');
        fetchBrandLines();
    }

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
            <PostViewDetail 
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
            />
        </>
    )
}

export default PostTable;