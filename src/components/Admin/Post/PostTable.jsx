import React, { useState, useEffect } from "react";
import { Table, Row, Col, Button, Switch, message, Modal } from "antd";
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
import { callFetchListPosts, setStatusArchivePost } from "../../../services/post";
import PostViewDetail from "./PostViewDetail";

const PostTable = () => {
    const [originalListPosts, setOriginalListPosts] = useState([]);
    const [listPosts, setListPosts] = useState([]);

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);

    const [isLoading, setIsLoading] = useState(false);

    const [dataViewDetail, setDataViewDetail] = useState("");
    const [openViewDetail, setOpenViewDetail] = useState(false);

    const [switchStates, setSwitchStates] = useState({}); // Trạng thái của các Switch


    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setIsLoading(true);
        const res = await callFetchListPosts();
        console.log('>>> check res post: ', res);
        if (res && res.result) {
            setOriginalListPosts(res.result);
            setListPosts(res.result);
            setTotal(res.result.length);

            // Khởi tạo trạng thái của Switch cho từng bài post (cập nhật ngược vì back-end lưu ngược so với front-end)
            const initialSwitchStates = {};
            res.result.forEach(post => {
                if (post.isArchived === true) {
                    initialSwitchStates[post.id] = false;
                } else {
                    initialSwitchStates[post.id] = true;
                }
                // initialSwitchStates[post.id] = post.isArchived;
            });
            setSwitchStates(initialSwitchStates);

        }
        setIsLoading(false);
    }

    const getUniqueFilterValues = (posts, keyPath) => {
        const values = posts.map(post => keyPath.reduce((acc, key) => acc?.[key], post)).filter(Boolean);
        return [...new Set(values)].map(value => ({ text: value, value }));
    }

    const handleToggle = async (checked, postId) => {
        Modal.confirm({
            title: 'Thông báo',
            content: `${checked ? 'Bạn có muốn mở trạng thái hoạt động hay không?' : 'Bạn có muốn tắt trạng thái hoạt động hay không?'}`,
            onOk: async () => {
                try {

                    await setStatusArchivePost(postId, !checked);

                    setSwitchStates({
                        ...switchStates,
                        [postId]: checked       // Cập nhật trạng thái hiển thị của Switch
                    });
                    message.success(`Cập nhật trạng thái hoạt động của bài Post thành công!`);
                } catch (error) {
                    message.error('Cập nhật trạng thái thất bại!');
                }
            },
            onCancel() {
                // Do nothing if canceled
            }
        });
    };

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
            title: 'Tên Sản Phẩm',
            width: '20%',
            align: 'center',
            dataIndex: 'productName',
            filters: getUniqueFilterValues(originalListPosts, ['product', 'name']),
            filterMode: 'tree',
            filterSearch: true,
            //onFilter: (value, record) => record?.product?.name.includes(value),
            render: (text, record) => {
                return (
                    <a href="#" onClick={() => {
                        setDataViewDetail(record);
                        setOpenViewDetail(true);
                    }}>
                        {record?.product?.name}
                    </a>
                )
            },
        },
        {
            title: 'Người Đăng Bài',
            width: '10%',
            align: 'center',
            dataIndex: 'username',
            filters: getUniqueFilterValues(originalListPosts, ['user', 'username']),
            filterMode: 'tree',
            filterSearch: true,
            //onFilter: (value, record) => record?.user?.username.includes(value),
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
            filters: getUniqueFilterValues(originalListPosts, ['product', 'brand', 'name']),
            filterMode: 'tree',
            filterSearch: true,
            //onFilter: (value, record) => record?.product?.brand?.name.includes(value),
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
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record?.product?.price ?? 0)}
                    </div>
                )
            },
        },
        {
            title: 'Mức độ xác minh',
            width: '10%',
            align: 'center',
            dataIndex: 'verifiedLevel',
            filters: getUniqueFilterValues(originalListPosts, ['product', 'verifiedLevel']),
            filterMode: 'tree',
            filterSearch: true,
            render: (text, record) => {
                return (
                    <>
                        {record?.product?.verifiedLevel === "LEVEL_2" &&
                            <div style={{ color: 'red' }}>
                                Xác minh cấp 2
                            </div>
                        }

                        {record?.product?.verifiedLevel === "LEVEL_1" &&
                            <div style={{ color: 'blue' }}>
                                Xác minh cấp 1
                            </div>
                        }
                    </>

                )
            },
        },
        {
            title: 'Trạng Thái Hoạt Động',
            width: '10%',
            align: 'center',
            key: 'status',
            render: (text, record) => {
                return (
                    <>
                        <Switch
                            checked={switchStates[record.id]}
                            onChange={(checked) => handleToggle(checked, record.id)}
                        />
                    </>
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

        let filteredData = [...originalListPosts];

        //Filter by Title
        if (filters.title) {
            filteredData = filteredData.filter(item => filters.title.includes(item.title))
        }

        //Filter by product name
        if (filters.productName) {
            filteredData = filteredData.filter(item => filters.productName.includes(item?.product?.name))
        }

        //Filter by username
        if (filters.username) {
            filteredData = filteredData.filter(item => filters.username.includes(item?.user?.username))
        }

        //Filter By Brand Name
        if (filters.brandName) {
            filteredData = filteredData.filter(item => filters.brandName.includes(item?.product?.brand?.name))
        }

        //Filter By Verify Level
        if (filters.verifiedLevel) {
            filteredData = filteredData.filter(item => filters.verifiedLevel.includes(item?.product?.verifiedLevel))
        }

        setListPosts(filteredData);
        setTotal(filteredData.length);

        console.log('>>> check onchange:', filters);
        
    }

    const renderHeader = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 20, fontFamily: 'bold', color: COLORS.primary }}>Table List Post</span>
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