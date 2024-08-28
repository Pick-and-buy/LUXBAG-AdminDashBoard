import React, { useState, useEffect } from "react";
import { Form, Select, Row, Divider, Modal, message, Input, notification, Col, InputNumber, Upload } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { callCreateCategory } from "../../../services/category";
import { callFetchListBrandLines } from "../../../services/brandLines";

const CategoryModalCreate = (props) => {
    const { openModalCreate, setOpenModalCreate } = props;
    const [isSubmit, setIsSubmit] = useState(false);

    const [listBrandLines, setListBrandLines] = useState([]);

    //https://ant.design/components/form#formuseform
    const [formHook] = Form.useForm();

    const fetchAllBrandLines = async () => {
        const res = await callFetchListBrandLines();
        console.log('>>> check res: ', res);
        if (res && res?.result) {
            const brandLine = res?.result.map(item => {
                return {
                    label: item.lineName,
                    value: item.lineName
                }
            })
            setListBrandLines(brandLine)
        }
    }

    useEffect(() => {
        fetchAllBrandLines();
    }, [])

    const onFinish = async (values) => {
        setIsSubmit(true);
        const request = {
            categoryName: values.categoryName,
            brandLine: { lineName: values.lineName }
        }
        const res = await callCreateCategory(request);
        if (res && res.result) {
            message.success('Cập nhật dòng thương hiệu thành công');
            formHook.resetFields();
            setOpenModalCreate(false);
            await props.fetchCategory();
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message
            })
        }
        setIsSubmit(false);
    }

    const onClose = () => {
        formHook.resetFields();
        setOpenModalCreate(false);
    }

    return (
        <>
            <Modal title="Thêm Mới Thể Loại"
                open={openModalCreate}
                onOk={() => { formHook.submit() }}
                onCancel={onClose}
                okText={"Tạo mới"}
                cancelText={"Hủy"}
                confirmLoading={isSubmit}
                width={500}
            >
                <Form
                    //Gán Hook- [useForm()] sau này có thể truy cập Form từ nơi khác để nhận submit
                    form={formHook}
                    name="basic"
                    style={{ width: '100%' }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Row gutter={12}>
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Thể Loại"
                                name="categoryName"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập thể loại',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Dòng Thương Hiệu"
                                name="lineName"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn dòng thương hiệu',
                                    },
                                ]}
                            >
                                <Select
                                    defaultValue=""
                                    showSearch
                                    allowClear
                                    options={listBrandLines}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    )
}

export default CategoryModalCreate;