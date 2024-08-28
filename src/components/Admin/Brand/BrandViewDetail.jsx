import React, { useEffect, useState } from 'react';
import { Badge, Descriptions, Drawer, Upload, Modal, Divider } from 'antd';
import { getBrandLineByBrandName } from "../../../services/brandLines";


const BrandViewDetail = (props) => {
    const { openViewDetail, setOpenViewDetail } = props;
    const dataViewDetail = props.dataViewDetail;

    const [listBrandLines, setListBrandLines] = useState([]);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        getAllBrandLinesByBrandName(dataViewDetail.name);
        console.log('>>> check data view detail <BandViewDetail>: ', dataViewDetail);
        if (dataViewDetail) {
            let imageBrand = [];
            if (dataViewDetail?.brandLogos && dataViewDetail?.brandLogos.length > 0) {
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

    const getAllBrandLinesByBrandName = async (brandName) => {
        let query = `brandName=${brandName}`;
        const res = await getBrandLineByBrandName(query);
        if (res && res.result) {
            setListBrandLines(res.result);
        }
    };

    console.log('>>> check list brand lines: ', listBrandLines);

    const onClose = () => {
        setOpenViewDetail(false);
    };

    const handleCancel = () => {
        setPreviewOpen(false)
    };

    const handlePreview = async (file) => {
        if (file.url) {
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
                    <Descriptions.Item label="Tên Thương Hiệu" contentStyle={{ textAlign: 'center' }}>{dataViewDetail.name}</Descriptions.Item>
                    {listBrandLines.length > 0 &&
                        <Descriptions.Item label="Dòng Thương Hiệu" span={2}>
                            {listBrandLines.map((item, index) => {
                                return (
                                    <div>
                                        {index + 1}. {item.lineName}
                                    </div>
                                )
                            })}
                        </Descriptions.Item>
                    }

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