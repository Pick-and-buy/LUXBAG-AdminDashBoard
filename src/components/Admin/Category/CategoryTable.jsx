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
import { callFetchListCategories, callDeleteCategory } from "../../../services/category";
import * as XLSX from 'xlsx';
import CategoryViewDetail from "./CategoryViewDetail";

const CategoryTable = () => {
    const [listCategories, setListCategories] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);

    const [isLoading, setIsLoading] = useState(false);

    const [dataViewDetail, setDataViewDetail] = useState("");
    const [openViewDetail, setOpenViewDetail] = useState(false);

    useEffect(() => {
        fetchCategory();
    }, [current, pageSize]);

    const fetchCategory = async () => {
        setIsLoading(true);
        const res = await callFetchListCategories();
        console.log('>>> check call get all Categories <Category Table>: ', res);
        if (res && res.result) {
            setListCategories(res.result);
            setTotal(res.result.length);
        }
        setIsLoading(false);
    }

    const columns = [
        {
            title: 'Id',
            width: '25%',
            align: 'center',
            dataIndex: 'id',
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
            title: 'Thể Loại',
            align: 'center',
            dataIndex: 'categoryName',
            sorter: (a, b) => a.categoryName.length - b.categoryName.length,
            filters: listCategories.map(category => ({
                text: category.categoryName,
                value: category.categoryName,
            })),
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => record.categoryName.includes(value),
        },
        {
            title: 'Dòng Thương Hiệu',
            align: 'center',
            dataIndex: 'lineName',
            render: (text, record) => {
                return (
                    <div>
                        {record.brandLine.lineName}
                    </div>
                )
            },
        },
        {
            title: 'Action',
            align: 'center',
            render: (text, record, index) => {
                return (
                    <>
                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận xóa thể loại"}
                            description={"Bạn có chắc chắn muốn xóa thể loại này?"}
                            onConfirm={() => handleDeleteBrand(record.categoryName)}
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
                            onClick={() => console.log('EDIT')}
                        />
                    </>
                )
            }
        },
    ];

    const handleDeleteBrand = async (name) => {
        let query = `categoryName=${name}`;
        await callDeleteCategory(query);
        message.success('Xóa thương thể loại thành công');
        fetchCategory();
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
        if (listCategories.length > 0) {
            const worksheet = XLSX.utils.json_to_sheet(listCategories);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
            XLSX.writeFile(workbook, "ExportCategory.csv");
        }
    }

    const renderHeader = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 20, fontFamily: 'bold', color: COLORS.primary }}>Table List Category</span>
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
                        dataSource={listCategories}
                        onChange={onChange}
                        rowKey="id"
                        pagination={
                            {
                                current: current,
                                pageSize: pageSize,
                                total: total,
                                showSizeChanger: true,
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
            <CategoryViewDetail 
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
            />
        </>
    )
}

export default CategoryTable;