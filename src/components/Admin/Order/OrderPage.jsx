import React, { useState, useEffect } from 'react';
import { Table, Card, Statistic, Row, Col, Tag, DatePicker, Popconfirm, message } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, FileTextOutlined, PauseCircleOutlined } from '@ant-design/icons';
import './order.scss';
import { callFetchListOrders, updateOrderStatusSeller } from '../../../services/order';
const { RangePicker } = DatePicker;

const OrderPage = () => {
    const [originalListOrders, setOriginalListOrders] = useState([]);
    const [listOrders, setListOrders] = useState([]);

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);

    const [isLoading, setIsLoading] = useState(false);

    const [processingOrder, setProcessingOrder] = useState([]);
    const [deliveringOrder, setDeliveringOrder] = useState([]);
    const [receivedOrder, setReceivedOrder] = useState([]);

    useEffect(() => {
        fetchAllOrder();
    }, []);

    const fetchAllOrder = async () => {
        setIsLoading(true);
        const res = await callFetchListOrders();
        console.log('>>> check res Order: ', res);
        if (res && res.result) {
            //Lọc tất cả các order có status = PENDING hoặc
            let orders = res?.result.filter(order => order.orderDetails.status === "PROCESSING" || order.orderDetails.status === "DELIVERING" || order.orderDetails.status === "RECEIVED");
            setOriginalListOrders(orders);
            setListOrders(orders);
            setTotal(orders.length);

            //Trạng thái đơn hàng chưa lấy
            setProcessingOrder(res?.result.filter(order => order.orderDetails.status === "PROCESSING").length);

            //Trạng thái đơn hàng đang giao
            setDeliveringOrder(res?.result.filter(order => order.orderDetails.status === "DELIVERING").length);

            //Trạng thái đã giao hàng thành công
            setReceivedOrder(res?.result.filter(order => order.orderDetails.status === "RECEIVED").length);

        }
        setIsLoading(false);
    }

    const getUniqueFilterValues = (orders, keyPath) => {
        const values = orders.map(post => keyPath.reduce((acc, key) => acc?.[key], post)).filter(Boolean);
        return [...new Set(values)].map(value => ({ text: value, value }));
    }

    const columns = [
        {
            title: 'ID Orders',
            width: '10%',
            dataIndex: 'id',
            ellipsis: true,  // This will truncate the text and add ellipsis
            render: (text, record) => {
                return (
                    <a href="#" onClick={() => {
                        // setDataViewDetail(record);
                        // setOpenViewDetail(true);
                    }}>
                        {record?.id}
                    </a>
                )
            },
        },
        {
            title: 'Người Bán',
            width: '15%',
            dataIndex: 'sellerName',
            filters: getUniqueFilterValues(originalListOrders, ['post', 'user', 'username']),
            filterMode: 'tree',
            filterSearch: true,
            render: (text, record) => {
                return (
                    <a href="#" onClick={() => {
                        // setDataViewDetail(record);
                        // setOpenViewDetail(true);
                    }}>
                        {record?.post?.user?.firstName} {record?.post?.user?.lastName}
                    </a>
                )
            },
        },
        {
            title: 'Tên sản phẩm',
            width: '20%',
            dataIndex: 'productName',
            filters: getUniqueFilterValues(originalListOrders, ['post', 'product', 'name']),
            filterMode: 'tree',
            filterSearch: true,
            render: (text, record) => {
                return (
                    <div>
                        {record?.post?.product?.name}
                    </div>
                )
            },
        },
        {
            title: 'SĐT Người Bán',
            width: '11%',
            dataIndex: 'phoneNumberSeller',
            render: (text, record) => {
                return (
                    <div>
                        {record?.post?.user?.phoneNumber}
                    </div>
                )
            },
        },
        {
            title: 'Người Mua',
            width: '15%',
            dataIndex: 'buyerName',
            render: (text, record) => {
                return (
                    <div>
                        {record?.buyer?.firstName} {record?.buyer?.lastName}
                    </div>
                )
            },
        },
        {
            title: 'SĐT Người Mua',
            width: '11%',
            dataIndex: 'phoneNumberBuyer',
            render: (text, record) => {
                return (
                    <div>
                        {record?.buyer?.phoneNumber}
                    </div>
                )
            },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            filters: getUniqueFilterValues(originalListOrders, ['orderDetails', 'status']),
            filterMode: 'tree',
            filterSearch: true,
            render: (text, record) => {
                let color;
                let statusText;
                const status = record?.orderDetails?.status;
                if (status === 'PROCESSING') {
                    color = 'green';
                    statusText = 'Processing';
                } else if (status === 'DELIVERING') {
                    color = 'yellow';
                    statusText = 'Delivering';
                } else if (status === 'RECEIVED') {
                    color = 'red';
                    statusText = 'Received';
                }
                return (
                    <>
                        {record?.orderDetails?.status === "PROCESSING" &&
                            <div style={{ cursor: "pointer", paddingLeft: 40 }}>
                                <Popconfirm
                                    placement="leftTop"
                                    style={{ cursor: "pointer" }}
                                    title={"Xác nhận cập nhật trạng thái"}
                                    description={"Bạn có chắc chắn muốn cập nhật trạng thái lên đang giao hàng?"}
                                    onConfirm={() => handleChangeStatus(record.id, "DELIVERING")}
                                    onText="Xác nhận"
                                    cancelText="Hủy"
                                >
                                    <Tag color={color}>{statusText}</Tag>
                                </Popconfirm>
                            </div>
                        }
                        {record?.orderDetails?.status === "DELIVERING" &&
                            <div style={{ cursor: "pointer", paddingLeft: 40 }}>
                                <Popconfirm
                                    placement="leftTop"
                                    title={"Xác nhận cập nhật trạng thái"}
                                    description={"Bạn có chắc chắn muốn cập nhật trạng thái đã nhận hàng?"}
                                    onConfirm={() => handleChangeStatus(record.id, "RECEIVED")}
                                    onText="Xác nhận"
                                    cancelText="Hủy"
                                >
                                    <Tag color={color}>{statusText}</Tag>
                                </Popconfirm>
                            </div>
                        }
                        {record?.orderDetails?.status === "RECEIVED" &&
                            <div style={{ paddingLeft: 40 }}>
                                <Tag color={color}>{statusText}</Tag>
                            </div>
                        }
                    </>
                )
            },
        },
    ];

    const handleChangeStatus = async (orderId, orderStatus) => {
        await updateOrderStatusSeller(orderId, orderStatus)
        message.success('Cập nhật trạng thái thành công!');
        fetchAllOrder();
    }

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('>>> check onchange:', filters);
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1)
        }

        let filteredData = [...originalListOrders];
        //Filter by sellerName
        if (filters.sellerName) {
            filteredData = filteredData.filter(item => filters.sellerName.includes(item.post.user.username))
        }

        //Filter by product name
        if (filters.productName) {
            filteredData = filteredData.filter(item => filters.productName.includes(item.post.product.name))
        }

        //Filter by status
        if (filters.status) {
            filteredData = filteredData.filter(item => filters.status.includes(item?.orderDetails?.status))
        }

        setListOrders(filteredData);
        setTotal(filteredData.length);
    }


    return (
        <>
            <div className="invoice-dashboard">
                <Row gutter={16} className="statistics-row">
                    <Col span={8}>
                        <Card>
                            <Statistic
                                title="Tổng số đơn hàng chưa lấy"
                                value={processingOrder}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card>
                            <Statistic
                                title="Tổng số đơn hàng đang giao"
                                value={deliveringOrder}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card>
                            <Statistic
                                title="Tổng số đơn hàng đã giao thành công"
                                value={receivedOrder}
                                prefix={<CheckCircleOutlined />}
                            />
                        </Card>
                    </Col>

                </Row>
                <Card className="payment-history">
                    <Row justify="space-between" className="payment-history-header">
                        <Col><h2 style={{ color: 'red' }}>Manage Order</h2></Col>
                        {/* <Col>
                            <RangePicker />
                        </Col> */}
                    </Row>
                </Card>

                <Table
                    loading={isLoading}
                    columns={columns}
                    dataSource={listOrders}
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
            </div>
        </>
    )
}

export default OrderPage;