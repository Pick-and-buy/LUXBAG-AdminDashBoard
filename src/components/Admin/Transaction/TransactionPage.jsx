import React, { useState, useEffect } from 'react';
import { Table, Card, Statistic, Row, Col, Tag, DatePicker } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import './transaction.scss';
const { RangePicker } = DatePicker;

const TransactionPage = () => {

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


    return (
        <>
            <div className="invoice-dashboard">
                <Row gutter={16} className="statistics-row">
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Total Invoices"
                                value={582}
                                prefix={<FileTextOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Paid Invoices"
                                value={346}
                                prefix={<CheckCircleOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Total Unpaid Invoices"
                                value={236}
                                prefix={<CloseCircleOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Total Invoices Sent"
                                value={126}
                                prefix={<FileTextOutlined />}
                            />
                        </Card>
                    </Col>
                </Row>
                <Card className="payment-history">
                    <Row justify="space-between" className="payment-history-header">
                        <Col><h2>Transaction Page</h2></Col>
                        <Col>
                            <RangePicker />
                        </Col>
                    </Row>
                </Card>
                <Table columns={columns} dataSource={data}/>
            </div>
        </>
    )
}

export default TransactionPage;