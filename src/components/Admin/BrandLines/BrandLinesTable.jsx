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
import { callFetchListBrandLines, callDeleteBrandLines } from "../../../services/brandLines";
import BrandLinesViewDetail from "./BrandLinesViewDetail";
import * as XLSX from 'xlsx';
import moment from "moment/moment";

const BrandLinesTable = () => {
    const [listBrand, setListBrand] = useState([]);
    const [listBrandLines, setListBrandLines] = useState([]);

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchBrandLines();
    }, [current, pageSize]);

    const fetchBrandLines = async () => {
        setIsLoading(true);
        const res = await callFetchListBrandLines();
        console.log('>>> check call get all Brand-Lines <BrandLines Table>: ', res);
        if (res && res.result) {
            setListBrandLines(res.result);
            setTotal(res.result.length);
        }
        setIsLoading(false);
    }

    // Get unique years and months
    const years = [...new Set(listBrandLines.map(item =>
        moment(item.launchDate).year()
    ))];
    const months = [...new Set(listBrandLines.map(item =>
        moment(item.launchDate).format('MM')
    ))];

    const columns = [
        {
            title: 'Id',
            align: 'center',
            dataIndex: 'id',
            sorter: (a, b) => a.id - b.id,
            render: (text, record, index) => {
                return (
                    <a href="#" onClick={() => {
                        setDataViewDetail(record);
                        setOpenViewDetail(true);
                    }}>
                        {record.id}
                    </a>
                )
            }
        },
        {
            title: 'Dòng Thương Hiệu',
            align: 'center',
            dataIndex: 'lineName',
            sorter: (a, b) => a.lineName.length - b.lineName.length,
            filters: listBrandLines.map(brandLines => ({
                text: brandLines.lineName,
                value: brandLines.lineName,
            })),
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => record.lineName.includes(value),
        },
        {
            title: 'Chữ Ký',
            align: 'center',
            dataIndex: 'signatureFeatures',
            sorter: (a, b) => a.signatureFeatures.length - b.signatureFeatures.length,
            filters: listBrandLines.map(brandLines => ({
                text: brandLines.signatureFeatures,
                value: brandLines.signatureFeatures,
            })),
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => record.signatureFeatures.includes(value),
        },
        {
            title: 'Phạm Vi Giá',
            align: 'center',
            dataIndex: 'priceRange',
        },
        {
            title: 'Ngày Phát Hành',
            align: 'center',
            dataIndex: 'launchDate',
            render: (text, record, index) => {
                return (
                    <div>
                        {moment(record.launchDate).format("DD-MM-YYYY")}
                    </div>
                )
            },
            sorter: (a, b) => moment(a.launchDate).year() - moment(b.launchDate).year(),
            filters: [
                {
                    text: 'Years',
                    value: 'year',
                    children: years.map(year => ({
                        text: year.toString(),
                        value: year.toString(),
                    })),
                },
                {
                    text: 'Months',
                    value: 'month',
                    children: months.map(month => ({
                        text: month,
                        value: month,
                    })),
                },
            ],
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => record.launchDate.includes(value),
        },
        {
            title: 'Action',
            align: 'center',
            render: (text, record, index) => {
                return (
                    <>
                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận xóa thương hiệu"}
                            description={"Bạn có chắc chắn muốn xóa thương hiệu này ?"}
                            //onConfirm={() => handleDeleteBrand(record.name)}
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
                            onClick={() => console.log('Edit')}
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
        console.log('check params', pagination, filters, sorter, extra);
    }

    const renderHeader = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 20, fontFamily: 'bold', color: COLORS.primary }}>Table List Brand-Lines</span>
                <span style={{ display: 'flex', gap: 10 }}>
                    <Button
                        icon={<ExportOutlined />}
                        type="primary"
                    >Export
                    </Button>
                    <Button
                        icon={<PlusOutlined />}
                        type="primary" danger
                    >Thêm mới
                    </Button>
                </span>
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
                        dataSource={listBrandLines}
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

export default BrandLinesTable;