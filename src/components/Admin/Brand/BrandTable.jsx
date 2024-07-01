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

const BrandTable = () => {
    const [listBrand, setListBrand] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);

    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("");

    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',  //đặt tên "_id" đúng theo database
            //Hàm Render() Columns cung cấp 1 param: record
            //record => chính là data tại cái row mà nó render ra
            render: (text, record, index) => {
                return (
                    <a href="#" onClick={() => console.log('detail')}>
                        {record._id}
                    </a>
                )
            }
        },
        {
            title: 'Tên Thương Hiệu',
            dataIndex: 'name',
            sorter: true,
        },
        {
            title: 'Action',
            width: 100,
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