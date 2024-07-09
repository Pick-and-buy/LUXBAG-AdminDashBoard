import React, { useEffect, useState } from "react";
import { Form, Select, Divider, Row, Col, Upload, Modal, message, Input, notification, Card } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { callFetchListBrandLines } from "../../../services/brandLines";
import { callUpdateNews } from "../../../services/news";
const { TextArea } = Input;

const NewsModalUpdate = (props) => {
    const { openModalUpdate, setOpenModalUpdate } = props;
    const { dataUpdate, setDataUpdate } = props;

    const [listBrandLines, setListBrandLines] = useState([]);
    const [isSubmit, setIsSubmit] = useState(false);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const [fileList, setFileList] = useState([]);

    //https://ant.design/components/form#formuseform
    const [formHook] = Form.useForm();

    const fetchAllBrandLines = async () => {
        const res = await callFetchListBrandLines();
        if (res && res?.result) {
            const brandLines = res?.result.map(item => {
                return {
                    label: item.lineName,
                    value: item.lineName
                }
            })
            setListBrandLines(brandLines);
        }
    }

    const onFinish = async (values) => {
        console.log(">>> check values <BrandLinesModalUpdate>: ", values);
        let query = `newsId=${dataUpdate?.id}`;
        const request = {
            brandLine: { lineName: values.lineName },
            title: values.title,
            content: values.content,
            subTitle1: values.subTitle1,
            subTitle2: values.subTitle2,
            subTitle3: values.subTitle3,
            subContent1: values.subContent1,
            subContent2: values.subContent2,
            subContent3: values.subContent3,
            subContent4: values.subContent4,
            subContent5: values.subContent5,
            subContent6: values.subContent6,
            subContent7: values.subContent7,
            subContent8: values.subContent8,
            subContent9: values.subContent9,
            subContent10: values.subContent10,
        }
        const formData = new FormData();
        formData.append('request', JSON.stringify(request));
        fileList.forEach(file => {
            formData.append('banner', file.originFileObj);
        });
        setIsSubmit(true);
        //call API Update News
        const res = await callUpdateNews(query, formData);
        if (res && res.result) {
            message.success('Cập nhật News thành công');
            formHook.resetFields();
            setOpenModalUpdate(false);
            await props.fetchNews();
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
            const banner = [{
                uid: dataUpdate?.id,
                name: dataUpdate?.title,
                status: 'done',
                url: dataUpdate?.banner
            }]
            setFileList(banner);
            const initValues = {
                title: dataUpdate?.title,
                content: dataUpdate?.content,
                subTitle1: dataUpdate?.subTitle1,
                subTitle2: dataUpdate?.subTitle2,
                subTitle3: dataUpdate?.subTitle3,
                subContent1: dataUpdate?.subContent1,
                subContent2: dataUpdate?.subContent2,
                subContent3: dataUpdate?.subContent3,
                subContent4: dataUpdate?.subContent4,
                subContent5: dataUpdate?.subContent5,
                subContent6: dataUpdate?.subContent6,
                subContent7: dataUpdate?.subContent7,
                subContent8: dataUpdate?.subContent8,
                subContent9: dataUpdate?.subContent9,
                subContent10: dataUpdate?.subContent10,
            }
            formHook.setFieldsValue(initValues);
            fetchAllBrandLines();
        }
        return () => {
            formHook.resetFields();
        }
    }, [dataUpdate])

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
        setOpenModalUpdate(false);
        setDataUpdate(null);
    }

    return (
        <>
            <Modal title="Cập Nhật Tin Tức"
                open={openModalUpdate}
                onOk={() => { formHook.submit() }}
                onCancel={onClose}
                okText={"Cập Nhật"}
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
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Tiêu Đề"
                                name="title"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập tiêu đề',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={12}>
                        <Col span={15}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Nội Dung"
                                name="content"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập nội dung bài báo',
                                    },
                                ]}
                            >
                                <TextArea rows={4} />
                            </Form.Item>
                        </Col>
                        <Col span={9}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Banner"
                                name="banner"
                            >
                                <Upload
                                    name="banner"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    maxCount={1}
                                    multiple={false}
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

                    {/* News 1 */}
                    <Row gutter={12}>
                        <Col span={24}>
                            <Card
                                size="small"
                                title="News 1"
                            >
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="SubTitle 1"
                                    name="subTitle1"
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="SubContent 1"
                                    name="subContent1"
                                >
                                    <TextArea rows={3} />
                                </Form.Item>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="SubContent 2"
                                    name="subContent2"
                                >
                                    <TextArea rows={3} />
                                </Form.Item>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="SubContent 3"
                                    name="subContent3"
                                >
                                    <TextArea rows={3} />
                                </Form.Item>
                            </Card>
                        </Col>
                    </Row>
                    <Divider />
                    {/* News 2 */}
                    <Row gutter={12}>
                        <Col span={24}>
                            <Card
                                size="small"
                                title="News 2"
                            >
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="SubTitle 2"
                                    name="subTitle2"
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="SubContent 4"
                                    name="subContent4"
                                >
                                    <TextArea rows={3} />
                                </Form.Item>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="SubContent 5"
                                    name="subContent5"
                                >
                                    <TextArea rows={3} />
                                </Form.Item>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="SubContent 6"
                                    name="subContent6"
                                >
                                    <TextArea rows={3} />
                                </Form.Item>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="SubContent 7"
                                    name="subContent7"
                                >
                                    <TextArea rows={3} />
                                </Form.Item>
                            </Card>
                        </Col>
                    </Row>
                    <Divider />
                    {/* News 3 */}
                    <Row gutter={12}>
                        <Col span={24}>
                            <Card
                                size="small"
                                title="News 3"
                            >
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="SubTitle 3"
                                    name="subTitle3"
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="SubContent 8"
                                    name="subContent8"
                                >
                                    <TextArea rows={3} />
                                </Form.Item>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="SubContent 9"
                                    name="subContent9"
                                >
                                    <TextArea rows={3} />
                                </Form.Item>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="SubContent 10"
                                    name="subContent10"
                                >
                                    <TextArea rows={3} />
                                </Form.Item>
                            </Card>
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

export default NewsModalUpdate;