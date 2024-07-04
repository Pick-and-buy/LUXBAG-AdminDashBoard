import React, { useEffect, useState } from "react";
import { Form, Divider, Row, Col, Upload, Modal, message, Input, notification } from "antd";
import { callUpdateBrand } from "../../../services/brand";
import { PlusOutlined } from "@ant-design/icons";

const BrandModalUpdate = (props) => {
    const { openModalUpdate, setOpenModalUpdate } = props;
    const { dataUpdate, setDataUpdate } = props;
    const [isSubmit, setIsSubmit] = useState(false);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const [fileList, setFileList] = useState([]);

    const [initForm, setInitForm] = useState(null);

    //https://ant.design/components/form#formuseform
    const [formHook] = Form.useForm();

    const onFinish = async (values) => {
        console.log(">>> check values <BrandModalCreate>: ", values);
        setIsSubmit(true);
        let query = `brandName=${dataUpdate.name}`;
        console.log('>>> check query: ', query);
        const res = await callUpdateBrand(query, values.name);
        if(res && res.result) {
            message.success('Cập nhật thương hiệu thành công');
            formHook.resetFields();
            setOpenModalUpdate(false);
            await props.fetchBrand();
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
            const brandLogos = dataUpdate?.brandLogos?.map(item => {
                return {
                    uid: item.id,
                    name: dataUpdate.name,
                    status: 'done',
                    url: item.logoUrl
                }
            })

            const init = {
                id: dataUpdate.id,
                name: dataUpdate.name,
                brandLogos: brandLogos,
            }
            setInitForm(init);  //dùng để update cả ảnh => ở phần update brand thì ko cần
            setFileList(brandLogos);
            formHook.setFieldsValue(init);
        }
        //bug: khi ấn xem giữa các bản ghi (record) sẽ bị lỗi data ảnh
        //Vì Khi nhấn nút dấu x sẽ không tắt modal nên bị lỗi data 
        //Giải pháp: mỗi lần biến dataUpdate thay đổi thì sẽ cho reset form
        return () => {
            formHook.resetFields();
        }
    }, [dataUpdate])

    //Khi preview thì sẽ thông qua url của ảnh chứ ko phải upload file gốc từ máy tính nên ko cần getBase64
    const handlePreview = async (file) => {
        console.log('>>> check preview File<BrandModalUpdate>: ', file);
        if(file.url) {
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
            <Modal title="Cập Nhật Thương Hiệu"
                open={openModalUpdate}
                onOk={() => { formHook.submit() }}
                onCancel={onClose}
                okText={"Cập Nhật"}
                cancelText={"Hủy"}
                confirmLoading={isSubmit}
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
                                label="Id"
                                name="id"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập id',
                                    },
                                ]}
                            >
                                <Input disabled />
                            </Form.Item>
                        </Col>
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
                                name="brandLogos"
                            >
                                <Upload
                                    name="brandLogos"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    multiple
                                    fileList={fileList} //fileList: Hiển thị cố định hình ảnh
                                    // beforeUpload={beforeUpload}
                                    // onChange={handleChange}
                                    onPreview={handlePreview}
                                    defaultFileList={initForm?.brandLogos ?? []}   //defaultFileList: cho phép thêm, xóa file ảnh
                                    showUploadList={{
                                        showRemoveIcon: false
                                    }}
                                >
                                    {/* <div>
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div> */}
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

export default BrandModalUpdate;