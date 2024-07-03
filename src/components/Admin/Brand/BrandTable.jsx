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
import { callFetchListBrands, callCreateBrand, getAllBrandByName, callDeleteBrand, callUpdateBrand } from "../../../services/brand";
import BrandViewDetail from "./BrandViewDetail";
import * as XLSX from 'xlsx';

const BrandTable = () => {
    const [listBrand, setListBrand] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);

    const [isLoading, setIsLoading] = useState(false);

    const [dataViewDetail, setDataViewDetail] = useState("");
    const [openViewDetail, setOpenViewDetail] = useState(false);

    useEffect(() => {
        fetchBrand();
    }, [current, pageSize]);

    const fetchBrand = async () => {
        setIsLoading(true);
        const res = await callFetchListBrands();
        console.log('>>> check call get all Brand <Brand Table>: ', res);
        if (res && res.result) {
            setListBrand(res.result);
            setTotal(listBrand.length);
        }

        setIsLoading(false);
    }

    const columns = [
        {
            title: 'Id',
            width: '25%',
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
            title: 'Tên Thương Hiệu',
            width: '50%',
            align: 'center',
            dataIndex: 'name',
            sorter: (a, b) => a.name.length - b.name.length,
            filters: listBrand.map(brand => ({
                text: brand.name,
                value: brand.name,
            })),
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => record.name.includes(value),
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
                            // onConfirm={() => handleDeleteUser(record.id)}
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
                            onClick={() => console.log('update brand')}
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

    const handleExportData = () => {
        //https://stackoverflow.com/questions/70871254/how-can-i-export-a-json-object-to-excel-using-nextjs-react
        if (listBrand.length > 0) {
            const worksheet = XLSX.utils.json_to_sheet(listBrand);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
            XLSX.writeFile(workbook, "ExportBrand.csv");
        }
    }

    const renderHeader = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 20, fontFamily: 'bold', color: COLORS.primary }}>Table List Brands</span>
                <span style={{ display: 'flex', gap: 20 }}>
                    <Button
                        icon={<ExportOutlined />}
                        type="primary"
                    onClick={() => handleExportData()}
                    >Export
                    </Button>
                    <Button
                        icon={<PlusOutlined />}
                        type="primary" danger
                    // onClick={() => setOpenModalCreate(true)}
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
                        dataSource={listBrand}
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
            <BrandViewDetail 
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
            />            
        </>
    )
}

export default BrandTable;