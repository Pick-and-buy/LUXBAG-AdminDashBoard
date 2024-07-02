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

const BrandTable = () => {
    const [listBrand, setListBrand] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);

    const [isLoading, setIsLoading] = useState(false);

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
                    <a href="#" onClick={() => console.log('detail')}>
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

    const renderHeader = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 20, fontFamily: 'bold', color: COLORS.primary }}>Table List Brands</span>
                <span style={{ display: 'flex', gap: 20 }}>
                    <Button
                        icon={<ExportOutlined />}
                        type="default"
                    // onClick={() => handleExportData()}
                    >Export
                    </Button>
                    <Button
                        icon={<PlusOutlined />}
                        type="dashed" danger
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

        </>
    )
}

export default BrandTable;