import React, { useEffect, useState } from 'react';
import { Badge, Descriptions, Drawer, Upload, Modal, Divider } from 'antd';

const BrandViewDetail = (props) => {
    const { openViewDetail, setOpenViewDetail } = props;
    const dataViewDetail = props.dataViewDetail;

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        console.log('>>> check data view detail <BandViewDetail>: ', dataViewDetail);
        if(dataViewDetail) {
            let imageBrand = [];
            if(dataViewDetail?.brandLogos && dataViewDetail?.brandLogos.length > 0) {
                dataViewDetail?.brandLogos.map(item => {
                    imageBrand.push({
                        uid: item.id,
                        name: item.logoUrl, // Đảm bảo name là chuỗi
                        status: 'done',
                        url: item.logoUrl,
                    })
                })
            }
            setFileList(imageBrand);
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
        if(file.url) {
            setPreviewImage(file.url || (file.preview));
            setPreviewOpen(true);
            //set tên brand khi người dùng muốn xem chi tiết ảnh
            setPreviewTitle(dataViewDetail.name)
            return;
        }
    };

    return (
        <>
            <Drawer title="Chức Năng Xem Chi Tiết"
                width={"40vw"}
                onClose={onClose}
                open={openViewDetail}
            >
                <Descriptions
                    title="Thông tin thương hiệu"
                    bordered
                    column={2}
                    layout="vertical"
                >
                    <Descriptions.Item label="Id">{dataViewDetail.id}</Descriptions.Item>
                    <Descriptions.Item label="Tên Thương Hiệu">{dataViewDetail.name}</Descriptions.Item>
                </Descriptions>
                <Divider>Ảnh Thương Hiệu</Divider>
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

export default BrandViewDetail;