import React, { useEffect, useState } from "react";
import { Form, Select, Divider, Row, Col, Upload, Modal, message, Input, notification } from "antd";
import { callFetchListBrandLines } from "../../../services/brandLines";
import { callUpdateCategory } from "../../../services/category";

const CategoryModalUpdate = (props) => {
    const { openModalUpdate, setOpenModalUpdate } = props;
    const { dataUpdate, setDataUpdate } = props;
    const [isSubmit, setIsSubmit] = useState(false);

    const [listBrandLines, setListBrandLines] = useState([]);

    //https://ant.design/components/form#formuseform
    const [formHook] = Form.useForm();

    const onFinish = async (values) => {
        console.log(">>> check values <CategoryModalUpdate>: ", values);
        setIsSubmit(true);
        let query = `categoryName=${dataUpdate.categoryName}`;
        const request = {
            categoryName: values.categoryName,
            brandLine: {
                lineName: values.lineName
            },
        }
        const res = await callUpdateCategory(query, request);
        if (res && res.result) {
            message.success('Cập nhật thể loại thành công');
            formHook.resetFields();
            setOpenModalUpdate(false);
            await props.fetchCategory();
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message
            })
        }
        setIsSubmit(false);
    }

    const fetchAllBrandLines = async () => {
        const res = await callFetchListBrandLines();
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
        if (dataUpdate?.id) {
            fetchAllBrandLines();
            const initValues = {
                categoryName: dataUpdate.categoryName,
            }
            formHook.setFieldsValue(initValues);
        }
        return () => {
            formHook.resetFields();
        }
    }, [dataUpdate])

    const onClose = () => {
        setOpenModalUpdate(false);
        setDataUpdate(null);
    }

    return (
        <>
            <Modal title="Cập Nhật Thể Loại"
                open={openModalUpdate}
                onOk={() => { formHook.submit() }}
                onCancel={onClose}
                okText={"Cập Nhật"}
                cancelText={"Hủy"}
                confirmLoading={isSubmit}
            >
                <Divider />
                <Form
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
                                    defaultValue={dataUpdate?.brandLine?.lineName}
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

export default CategoryModalUpdate;