import React, { useEffect, useState } from "react";
import { Form, Select, DatePicker, Divider, Row, Col, Upload, Modal, message, Input, notification } from "antd";
import { callUpdateBrandLines } from "../../../services/brandLines";
import moment from "moment/moment";
import { callFetchListBrands } from "../../../services/brand";
const { TextArea } = Input;

const BrandLinesModalUpdate = (props) => {
    const { openModalUpdate, setOpenModalUpdate } = props;
    const { dataUpdate, setDataUpdate } = props;

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

    const onFinish = async (values) => {
        console.log(">>> check values <BrandLinesModalUpdate>: ", values);
        setIsSubmit(true);
        let query = `brandLineName=${dataUpdate.lineName}`;
        const request = {
            brandRequest: { name: values.name },
            lineName: values.lineName,
            description: values.description,
            signatureFeatures: values.signatureFeatures,
            priceRange: values.priceRange,
            launchDate: values.launchDate ? values.launchDate.format('YYYY-MM-DD') : null
        }
        const res = await callUpdateBrandLines(query, request);
        if (res && res.result) {
            message.success('Cập nhật dòng thương hiệu thành công');
            formHook.resetFields();
            setOpenModalUpdate(false);
            await props.fetchBrandLines();
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message
            })
        }
        setIsSubmit(false);
    }

    useEffect(() => {
        console.log('>>> check data update: ', dataUpdate);
        if (dataUpdate?.id) {
            const brandLineImages = dataUpdate?.brandLineImages.map(item => {
                return {
                    uid: item.id,
                    name: dataUpdate.lineName,
                    status: 'done',
                    url: item.lineImageUrl
                }
            })
            setFileList(brandLineImages);
            // const dataUpdateWithMomentDate = {
            //     ...dataUpdate,
            //     launchDate: dataUpdate.launchDate ? moment(dataUpdate.launchDate) : null,
            // }
            // formHook.setFieldsValue(dataUpdateWithMomentDate);
            fetchAllBrand();
        }
        return () => {
            formHook.resetFields();
        }
    }, [dataUpdate])

    const handlePreview = async (file) => {
        if (file.url) {
            setPreviewImage(file.url || (file.preview));
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
            return;
        }
    };

    const onClose = () => {
        setOpenModalUpdate(false);
        setDataUpdate(null);
    }

    return (
        <>
            <Modal title="Cập Nhật Dòng Thương Hiệu"
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
                    initialValues={{
                        lineName: dataUpdate?.lineName,
                        signatureFeatures: dataUpdate?.signatureFeatures,
                        priceRange: dataUpdate?.priceRange,
                        launchDate: dataUpdate?.launchDate ? moment(dataUpdate.launchDate) : null,
                        description: dataUpdate?.description,
                    }}
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
                                label="Chữ Ký"
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
                                <TextArea rows={5} />
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
                                    onPreview={handlePreview}
                                    showUploadList={{
                                        showRemoveIcon: false
                                    }}
                                >
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

export default BrandLinesModalUpdate;