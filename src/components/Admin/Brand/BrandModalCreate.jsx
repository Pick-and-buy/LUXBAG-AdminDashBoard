import React, { useState, useEffect } from "react";
import { Form, Select, Row, Divider, Modal, message, Input, notification, Col, InputNumber, Upload } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { callCreateBrand } from "../../../services/brand";

const BrandModalCreate = (props) => {
    const { openModalCreate, setOpenModalCreate } = props;
    const [isSubmit, setIsSubmit] = useState(false);

    const [dataBrand, setDataBrand] = useState([]);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const [fileList, setFileList] = useState([]);

    //https://ant.design/components/form#formuseform
    const [formHook] = Form.useForm();

    const onFinish = async (values) => {
        console.log(">>> check values <BrandModalCreate>: ", values);
        console.log(">>> check fileList <BrandModalCreate>: ", fileList);
        
        const formData = new FormData();

        const request = {
            name: values.name
        }
        formData.append('request', JSON.stringify(request));
        fileList.forEach(file => {
            formData.append('brandLogo', file.originFileObj);
        });

        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }
        await callCreateBrand(formData);
    }

    const handleUploadFile = async ({ file, onSuccess, onError }) => {
        console.log(file);
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
        console.log('>>> check handleChange FileList: ', newFileList);
        setFileList(newFileList);
    }

    const handleRemoveFile = (file, type) => {
        if (type === 'brand') {
            setDataBrand([]);
        }
    }

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || (file.preview));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const onClose = () => {
        formHook.resetFields();
        setOpenModalCreate(false)
    }

    return (
        <>
            <Modal title="Thêm Mới Thương Hiệu"
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
                                label="Tên Thương Hiệu"
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập tên thương hiệu',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={12}>
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Ảnh Thương Hiệu"
                                name="logoUrl"
                            >
                                <Upload
                                    name="logoUrl"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    multiple
                                    fileList={fileList}
                                    //customRequest={handleUploadFile}
                                    beforeUpload={beforeUpload}
                                    onChange={handleChange}
                                    onRemove={(file) => handleRemoveFile(file, "brand")}
                                    onPreview={handlePreview}
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
export default BrandModalCreate;