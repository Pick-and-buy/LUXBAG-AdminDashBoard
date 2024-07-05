import React, { useEffect, useState } from 'react';
import { Badge, Descriptions, Drawer, Upload, Modal, Divider } from 'antd';
import moment from "moment/moment";

const BrandLinesViewDetail = (props) => {
    const { openViewDetail, setOpenViewDetail } = props;
    const dataViewDetail = props.dataViewDetail;

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        console.log('>>> check data view detail <BandViewDetail>: ', dataViewDetail);
        if (dataViewDetail) {
            let imageBrandLines = [];
            if (dataViewDetail?.brandLineImages && dataViewDetail?.brandLineImages.length > 0) {
                dataViewDetail?.brandLineImages.map(item => {
                    imageBrandLines.push({
                        uid: item.id,
                        name: dataViewDetail.lineName,
                        status: 'done',
                        url: item.lineImageUrl,
                    })
                })
            }
            setFileList(imageBrandLines);
        }
    }, [dataViewDetail])

    const onClose = () => {
        setOpenViewDetail(false);
    };

    const handleCancel = () => {
        setPreviewOpen(false)
    };

    const handlePreview = async (file) => {
        console.log('>>> check file: ', file);
        if (file.url) {
            setPreviewImage(file.url || (file.preview));
            setPreviewOpen(true);
            setPreviewTitle(dataViewDetail.lineName)
            return;
        }
    };

    return (
        <>
            <Drawer title="Chức Năng Xem Chi Tiết"
                width={"50vw"}
                onClose={onClose}
                open={openViewDetail}
            >
                <Descriptions
                    title="Thông tin thương hiệu"
                    bordered
                    column={2}
                >
                    <Descriptions.Item label="Id">{dataViewDetail.id}</Descriptions.Item>
                    <Descriptions.Item label="Dòng Thương Hiệu">{dataViewDetail.lineName}</Descriptions.Item>
                    <Descriptions.Item label="Mô Tả" span={2}>{dataViewDetail.description}</Descriptions.Item>
                    <Descriptions.Item label="Ngày Phát Hành">
                        {moment(dataViewDetail.launchDate).format("DD-MM-YYYY")}
                    </Descriptions.Item>
                    <Descriptions.Item label="Chữ Ký">{dataViewDetail.signatureFeatures}</Descriptions.Item>
                    <Descriptions.Item label="Trạng Thái">
                        <Badge status="processing" text="Đang hoạt động" />
                    </Descriptions.Item>
                    <Descriptions.Item label="Phạm Vi Giá">{dataViewDetail.priceRange}</Descriptions.Item>
                    <Descriptions.Item label="createdAt">
                        {moment(dataViewDetail.createdAt).format("DD-MM-YYYY")}
                    </Descriptions.Item>
                    <Descriptions.Item label="updatedAt">
                        {moment(dataViewDetail.updatedAt).format("DD-MM-YYYY")}
                    </Descriptions.Item>

                </Descriptions>
                <Divider orientation="left">Ảnh Dòng Thương Hiệu</Divider>
                <Upload
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    showUploadList={
                        { showRemoveIcon: false }
                    }
                >
                </Upload>
                <Modal
                    open={previewOpen}
                    title={previewTitle}
                    footer={null}
                    onCancel={handleCancel}
                >
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </Drawer>
        </>
    )
}

export default BrandLinesViewDetail;