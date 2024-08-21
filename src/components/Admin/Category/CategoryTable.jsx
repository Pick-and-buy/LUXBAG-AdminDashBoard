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
import CategoryModalCreate from "./CategoryModalCreate";
import CategoryModalUpdate from "./CategoryModalUpdate";

const CategoryTable = () => {
    const [originalListCategories, setOriginalListCategories] = useState([]);
    const [listCategories, setListCategories] = useState([]);
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
        fetchCategory();
    }, []);

    const fetchCategory = async () => {
        setIsLoading(true);
        const res = await callFetchListCategories();
        console.log('>>> check call get all Categories <Category Table>: ', res);
        if (res && res.result) {
            setOriginalListCategories(res.result);
            setListCategories(res.result);
            setTotal(res.result.length);
        }
        setIsLoading(false);
    }

    const getUniqueFilterValues = (listCategory, keyPath) => {
        const values = listCategory.map(category => keyPath.reduce((acc, key) => acc?.[key], category)).filter(Boolean);
        return [...new Set(values)].map(value => ({ text: value, value }));
    }

    const columns = [
        {
            title: 'STT',
            width: '10%',
            align: 'center',
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
            title: 'Thể Loại',
            align: 'center',
            dataIndex: 'categoryName',
            sorter: (a, b) => a.categoryName.length - b.categoryName.length,
            filters: originalListCategories.map(category => ({
                text: category.categoryName,
                value: category.categoryName,
            })),
            filterMode: 'tree',
            filterSearch: true,
            render: (text, record) => {
                return (
                    <a href="#" onClick={() => {
                        setDataViewDetail(record);
                        setOpenViewDetail(true);
                    }}>
                        {record.categoryName}
                    </a>
                )
            },
        },
        {
            title: 'Dòng Thương Hiệu',
            align: 'center',
            dataIndex: 'lineName',
            sorter: (a, b) => a?.brandLine?.lineName.length - b?.brandLine?.lineName.length,
            filters: getUniqueFilterValues(originalListCategories, ['brandLine', 'lineName']),
            filterMode: 'tree',
            filterSearch: true,
            //onFilter: (value, record) => record?.brandLine?.lineName.includes(value),
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
            width: '10%',
            render: (text, record, index) => {
                return (
                    <>
                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận xóa thể loại"}
                            description={"Bạn có chắc chắn muốn xóa thể loại này?"}
                            onConfirm={() => handleDeleteCategory(record.categoryName)}
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

    const handleDeleteCategory = async (name) => {
        let query = `categoryName=${name}`;
        await callDeleteCategory(query);
        message.success('Xóa thể loại thành công');
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

        let filteredData = [...originalListCategories];

        //Filter by category name
        if(filters.categoryName) {
            filteredData = filteredData.filter(item => filters.categoryName.includes(item.categoryName))
        }

        //Filter by brand line name
        if(filters.lineName) {
            filteredData = filteredData.filter(item => filters.lineName.includes(item.brandLine.lineName))
        }

        setListCategories(filteredData);
        setTotal(filteredData.length);

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
                    {/* <Button
                        icon={<ExportOutlined />}
                        type="primary"
                        onClick={() => handleExportData()}
                    >Export
                    </Button> */}
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
            <CategoryModalCreate 
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                fetchCategory={fetchCategory}
            />
            <CategoryModalUpdate 
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                fetchCategory={fetchCategory}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
            />
        </>
    )
}

export default CategoryTable;