import React, { useState, useEffect } from 'react';
import { Table, Card, Statistic, Row, Col, Tag, DatePicker } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, FileTextOutlined, PauseCircleOutlined } from '@ant-design/icons';
import './order.scss';
const { RangePicker } = DatePicker;

const OrderPage = () => {
    const [originalListOrders, setOriginalListOrders] = useState([]);
    const [listOrders, setListOrders] = useState([]);

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);

    const [isLoading, setIsLoading] = useState(false);

    const data = [
        {
            key: '1',
            id: '#123412451',
            date: 'June 1, 2020, 08:22 AM',
            recipient: 'XYZ Store ID',
            email: 'xyzstore@mail.com',
            serviceType: 'Server Maintenance',
            status: 'Completed'
        },
        {
            key: '2',
            id: '#123412452',
            date: 'June 1, 2020, 08:22 AM',
            recipient: 'David Oconner',
            email: 'davidocon@mail.com',
            serviceType: 'Clean Up',
            status: 'Pending'
        },
        {
            key: '3',
            id: '#123412453',
            date: 'June 1, 2020, 08:22 AM',
            recipient: 'Julia Esteh',
            email: 'juliaesteh@mail.com',
            serviceType: 'Upgrade Component',
            status: 'Cancelled'
        },
    ];

    useEffect(() => {
        fetchAllOrder();
    }, []);

    const fetchAllOrder = async () => {

    }

    const columns = [
        {
            title: 'ID Invoice',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Recipient',
            dataIndex: 'recipient',
            key: 'recipient',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Service Type',
            dataIndex: 'serviceType',
            key: 'serviceType',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: status => {
                let color;
                let text;
                if (status === 'Completed') {
                    color = 'green';
                    text = 'Completed';
                } else if (status === 'Pending') {
                    color = 'orange';
                    text = 'Pending';
                } else {
                    color = 'red';
                    text = 'Cancelled';
                }
                return <Tag color={color}>{text}</Tag>;
            }
        },
    ];

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('>>> check onchange:', filters);

    }


    return (
        <>
            <div className="invoice-dashboard">
                <Row gutter={16} className="statistics-row">
                    <Col span={8}>
                        <Card>
                            <Statistic
                                title="Tổng số đơn hàng chưa lấy"
                                value={582}
                                prefix={<CloseCircleOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card>
                            <Statistic
                                title="Tổng số đơn hàng đang giao thành công"
                                value={346}
                                prefix={<PauseCircleOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card>
                            <Statistic
                                title="Tổng số đơn hàng đã giao"
                                value={236}
                                prefix={<CheckCircleOutlined />}
                            />
                        </Card>
                    </Col>

                </Row>
                <Card className="payment-history">
                    <Row justify="space-between" className="payment-history-header">
                        <Col><h2 style={{ color: 'red' }}>Manage Order</h2></Col>
                        <Col>
                            <RangePicker />
                        </Col>
                    </Row>
                </Card>

                <Table
                    loading={isLoading}
                    columns={columns}
                    dataSource={data}
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