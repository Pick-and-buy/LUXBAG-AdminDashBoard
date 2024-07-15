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
import BrandLinesModalCreate from './BrandLinesModalCreate';
import * as XLSX from 'xlsx';
import moment from "moment/moment";
import BrandLinesModalUpdate from './BrandLinesModalUpdate';

const BrandLinesTable = () => {
    const [listBrandLines, setListBrandLines] = useState([]);

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);

    const [isLoading, setIsLoading] = useState(false);

    const [dataViewDetail, setDataViewDetail] = useState("");
    const [openViewDetail, setOpenViewDetail] = useState(false);

    const [openModalCreate, setOpenModalCreate] = useState(false);

    const [dataUpdate, setDataUpdate] = useState([]);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);

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

    const getUniqueFilterValues = (listBrandLine, keyPath) => {
        const values = listBrandLine.map(brandLine => keyPath.reduce((acc, key) => acc?.[key], brandLine)).filter(Boolean);
        return [...new Set(values)].map(value => ({ text: value, value }));
    }

    const columns = [
        {
            title: 'Id',
            align: 'center',
            dataIndex: 'id',
            //sorter: (a, b) => a.id - b.id,
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
            render: (text, record, index) => {
                return (
                    <a href="#" onClick={() => {
                        setDataViewDetail(record);
                        setOpenViewDetail(true);
                    }}>
                        {record.lineName}
                    </a>
                )
            }
        },
        {
            title: 'Thương Hiệu',
            align: 'center',
            dataIndex: 'brandName',
            filters: getUniqueFilterValues(listBrandLines, ['brand', 'name']),
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => record?.brand?.name.includes(value),
            render: (text, record, index) => {
                return (
                    <div>
                        {record?.brand?.name}
                    </div>
                )
            }
        },
        {
            title: 'Signature',
            align: 'center',
            dataIndex: 'signatureFeatures',
            //sorter: (a, b) => a.signatureFeatures.length - b.signatureFeatures.length,
            filters: getUniqueFilterValues(listBrandLines, ['signatureFeatures']),
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
                        text: year,
                        value: year,
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
                            description={"Bạn có chắc chắn muốn xóa dòng thương hiệu này?"}
                            onConfirm={() => handleDeleteBrandLines(record.lineName)}
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
                                setOpenModalUpdate(true);
                                setDataUpdate(record);
                            }}
                        />
                    </>
                )
            }
        },
    ];

    const handleDeleteBrandLines = async (brandLineName) => {
        let query = `brandLineName=${brandLineName}`;
        const res = await callDeleteBrandLines(query);
        console.log('>>> check res DELETE BRAND-LINES: ', res);
        message.success('Xóa dòng thương hiệu thành công');
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
        console.log('check params', pagination, filters, sorter, extra);
    }

    const handleExportData = () => {
        //https://stackoverflow.com/questions/70871254/how-can-i-export-a-json-object-to-excel-using-nextjs-react
        if (listBrandLines.length > 0) {
            const worksheet = XLSX.utils.json_to_sheet(listBrandLines);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
            XLSX.writeFile(workbook, "ExportBrand-Lines.csv");
        }
    }

    const renderHeader = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 20, fontFamily: 'bold', color: COLORS.primary }}>Table List Brand-Lines</span>
                <span style={{ display: 'flex', gap: 10 }}>
                    <Button
                        icon={<ExportOutlined />}
                        type="primary"
                        onClick={() => handleExportData()}
                    >Export
                    </Button>
                    <Button
                        icon={<PlusOutlined />}
                        type="primary" danger
                        onClick={() => setOpenModalCreate(true)}
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
            <BrandLinesViewDetail
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
            />
            <BrandLinesModalCreate
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                fetchBrandLines={fetchBrandLines}
            />
            <BrandLinesModalUpdate
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                fetchBrandLines={fetchBrandLines}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
            />
        </>
    )
}

export default BrandLinesTable;