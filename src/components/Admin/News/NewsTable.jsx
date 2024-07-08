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
import { callFetchListNews, callDeleteNews } from "../../../services/news";
import NewsViewDetail from './NewsViewDetail';
import NewsModalCreate from "./NewsModalCreate";
import NewsModalUpdate from "./NewsModalUpdate";


const NewsTable = () => {
    const [listNews, setListNews] = useState([]);

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
        fetchNews();
    }, [current, pageSize]);

    const fetchNews = async () => {
        setIsLoading(true);
        const res = await callFetchListNews();
        console.log('>>> check call get all News <News Table>: ', res);
        if (res && res.result) {
            setListNews(res.result);
            setTotal(res.result.length);
        }
        setIsLoading(false);
    }

    const columns = [
        {
            title: 'Id',
            width: '10%',
            align: 'center',
            dataIndex: 'id',
            ellipsis: true,
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
            title: 'Tiêu Đề',
            width: '25%',
            align: 'center',
            dataIndex: 'title',
            ellipsis: true,
            sorter: (a, b) => a.title.length - b.title.length,
            filters: listNews.map(news => ({
                text: news.title,
                value: news.title,
            })),
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => record.title.includes(value),
            render: (text, record) => {
                return (
                    <a href="#" onClick={() => {
                        setDataViewDetail(record);
                        setOpenViewDetail(true);
                    }}>
                        {record.title}
                    </a>
                )
            }
        },
        {
            title: 'Thương Hiệu',
            width: '15%',
            align: 'center',
            dataIndex: 'name',
            sorter: (a, b) => a?.brandLine?.brand?.name.length - b?.brandLine?.brand?.name.length,
            filters: listNews.map(news => ({
                text: news.brandLine?.brand?.name,
                value: news.brandLine?.brand?.name,
            })),
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => record.brandLine?.brand?.name.includes(value),
            render: (text, record) => {
                return (
                    <div>
                        {record?.brandLine?.brand?.name}
                    </div>
                )
            },
        },
        {
            title: 'Dòng Thương Hiệu',
            width: '15%',
            align: 'center',
            dataIndex: 'lineName',
            sorter: (a, b) => a?.brandLine?.lineName.length - b?.brandLine?.lineName.length,
            filters: listNews.map(news => ({
                text: news.brandLine?.lineName,
                value: news.brandLine?.lineName,
            })),
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => record.brandLine?.lineName.includes(value),
            render: (text, record) => {
                return (
                    <div>
                        {record.brandLine.lineName}
                    </div>
                )
            },
        },
        {
            title: 'Nội Dung',
            align: 'center',
            dataIndex: 'content',
            ellipsis: true,
        },
        {
            title: 'Action',
            width: '10%',
            align: 'center',
            render: (text, record, index) => {
                return (
                    <>
                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận xóa news"}
                            description={"Bạn có chắc chắn muốn xóa news?"}
                            onConfirm={() => handleDeleteNews(record.id)}
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

    const handleDeleteNews = async (id) => {
        let query = `newsId=${id}`;
        const res = await callDeleteNews(query);
        message.success('Xóa news thành công');
        fetchNews();
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

    const renderHeader = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 20, fontFamily: 'bold', color: COLORS.primary }}>News</span>
                <span style={{ display: 'flex', gap: 10 }}>
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
                        dataSource={listNews}
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
            <NewsViewDetail
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
            />
            <NewsModalCreate
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                fetchNews={fetchNews}
            />
            <NewsModalUpdate 
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                fetchNews={fetchNews}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
            />
        </>
    )
}

export default NewsTable;