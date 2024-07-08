import React, { useState, useEffect } from "react";
import { Form, Select, DatePicker, Row, Divider, Modal, message, Input, notification, Col, InputNumber, Upload } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import moment from "moment/moment";
import { callCreateBrandLines } from "../../../services/brandLines";
import { callFetchListBrands } from "../../../services/brand";
const { TextArea } = Input;

const BrandLinesModalCreate = (props) => {
    const { openModalCreate, setOpenModalCreate } = props;

    const [listBrand, setListBrand] = useState([]);
    const [isSubmit, setIsSubmit] = useState(false);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const [fileList, setFileList] = useState([]);

    //https://ant.design/components/form#formuseform
    const [formHook] = Form.useForm();

    const fetchAllBrand = async () => {
        const res = await callFetchListBrands();
        if (res && res?.result) {
            const brand = res?.result.map(item => {
                return {
                    label: item.name,
                    value: item.name
                }
            })
            setListBrand(brand);
        }
    }

    useEffect(() => {
        fetchAllBrand();
    }, [])

    const onFinish = async (values) => {
        console.log(">>> check values <BrandLinesModalCreate>: ", values);
        const request = {
            brandRequest: { name: values.name },
            lineName: values.lineName,
            description: values.description,
            signatureFeatures: values.signatureFeatures,
            priceRange: values.priceRange,
            launchDate: values.launchDate ? values.launchDate.format('YYYY-MM-DD') : null
        }

        const formData = new FormData();
        formData.append('request', JSON.stringify(request));
        fileList.forEach(file => {
            formData.append('brandLineImages', file.originFileObj);
        });
        
        setIsSubmit(true);
        //Call API CREATE BrandLines
        const res = await callCreateBrandLines(formData);
        if (res && res.result) {
            message.success('Tạo mới dòng thương hiệu thành công')
            formHook.resetFields();
            setFileList([]);
            setOpenModalCreate(false);
            await props.fetchBrandLines();
        } else {
            notification.error({
                message: 'Đã Có lỗi xảy ra',
                description: res.message,
            })
        }
        setIsSubmit(false);
    }

    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const handleChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    }

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || (file.preview));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    //fix lỗi khi upload ảnh sẽ tự động call API và khi endpoint ở back-end không có url trùng khớp sẽ lỗi 404
    //customRequest: cho phép kiểm soát quá trình upload ảnh: default: success
    const customRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
    };

    const onClose = () => {
        formHook.resetFields();
        setOpenModalCreate(false)
    }

    return (
        <>
            <Modal title="Thêm Mới Dòng Thương Hiệu"
                open={openModalCreate}
                onOk={() => { formHook.submit() }}
                onCancel={onClose}
                okText={"Tạo mới"}
                cancelText={"Hủy"}
                confirmLoading={isSubmit}
                width={700}
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
                                label="Tên Thương Hiệu"
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn tên thương hiệu',
                                    },
                                ]}
                            >
                                <Select
                                    defaultValue=""
                                    showSearch
                                    allowClear
                                    options={listBrand}
                                />
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
                                        message: 'Vui lòng nhập dòng thương hiệu',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={12}>
                        <Col span={8}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Signature"
                                name="signatureFeatures"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập chữ ký',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Phạm Vi Giá"
                                name="priceRange"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập phạm vi giá',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Ngày Phát Hành"
                                name="launchDate"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập ngày phát hành',
                                    },
                                ]}
                            >
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={12}>
                        <Col span={24}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Mô Tả"
                                name="description"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập mô tả',
                                    },
                                ]}
                            >
                                <TextArea rows={4} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={12}>
                        <Col span={24}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Ảnh Dòng Thương Hiệu"
                                name="brandLineImages"
                            >
                                <Upload
                                    name="brandLineImages"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    multiple
                                    fileList={fileList}
                                    beforeUpload={beforeUpload}
                                    onChange={handleChange}
                                    onPreview={handlePreview}
                                    customRequest={customRequest}
                                >
                                    <div>
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
            <Modal
                open={previewOpen}
                title={previewTitle}
                footer={null}
                onCancel={() => setPreviewOpen(false)}
            >
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>
    )
}

export default BrandLinesModalCreate;