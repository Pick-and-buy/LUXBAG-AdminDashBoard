import React, { useEffect, useState } from 'react';
import { Badge, Descriptions, Drawer, Upload, Modal, Divider } from 'antd';
import moment from "moment/moment";

const NewsViewDetail = (props) => {
    const { openViewDetail, setOpenViewDetail } = props;
    const dataViewDetail = props.dataViewDetail;

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        console.log('>>> check data view detail <BandViewDetail>: ', dataViewDetail);
        if (dataViewDetail) {
            let bannerImage = [];
            if (dataViewDetail?.banner) {
                bannerImage.push({
                    uid: dataViewDetail.id,
                    name: dataViewDetail.title,
                    status: 'done',
                    url: dataViewDetail.banner,
                })
            }
            setFileList(bannerImage);
        }
    }, [dataViewDetail])


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
            setPreviewTitle(dataViewDetail.title)
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
                    title="Thông tin tin tức"
                    bordered
                    column={2}
                >
                    <Descriptions.Item label="Tiêu Đề" span={2} contentStyle={{textAlign: 'center', color: 'blue'}}>{dataViewDetail.title}</Descriptions.Item>
                    <Descriptions.Item label="Thương Hiệu">{dataViewDetail?.brandLine?.brand?.name}</Descriptions.Item>
                    <Descriptions.Item label="Dòng Thương Hiệu" >{dataViewDetail?.brandLine?.lineName}</Descriptions.Item>
                    <Descriptions.Item label="Nội Dung" span={2}>{dataViewDetail.content}</Descriptions.Item>
                    {dataViewDetail?.subTitle1 ?
                        <Descriptions.Item label="SubTitle_1" span={2}>{dataViewDetail.subTitle1}</Descriptions.Item>
                        :
                        <></>
                    }
                    {dataViewDetail?.subContent1 ?
                        <Descriptions.Item label="SubContent_1" span={2}>{dataViewDetail.subContent1}</Descriptions.Item>
                        :
                        <></>
                    }
                    {dataViewDetail?.subContent2 ?
                        <Descriptions.Item label="SubContent_2" span={2}>{dataViewDetail.subContent2}</Descriptions.Item>
                        :
                        <></>
                    }
                    {dataViewDetail?.subContent3 ?
                        <Descriptions.Item label="SubContent_3" span={2}>{dataViewDetail.subContent3}</Descriptions.Item>
                        :
                        <></>
                    }
                    {dataViewDetail?.subTitle2 ?
                        <Descriptions.Item label="SubTitle_2" span={2}>{dataViewDetail.subTitle2}</Descriptions.Item>
                        :
                        <></>
                    }
                    {dataViewDetail?.subContent4 ?
                        <Descriptions.Item label="SubContent_4" span={2}>{dataViewDetail.subContent4}</Descriptions.Item>
                        :
                        <></>
                    }
                    {dataViewDetail?.subContent5 ?
                        <Descriptions.Item label="SubContent_5" span={2}>{dataViewDetail.subContent5}</Descriptions.Item>
                        :
                        <></>
                    }
                    {dataViewDetail?.subContent6 ?
                        <Descriptions.Item label="SubContent_6" span={2}>{dataViewDetail.subContent6}</Descriptions.Item>
                        :
                        <></>
                    }
                    {dataViewDetail?.subContent7 ?
                        <Descriptions.Item label="SubContent_7" span={2}>{dataViewDetail.subContent7}</Descriptions.Item>
                        :
                        <></>
                    }
                    {dataViewDetail?.subTitle3 ?
                        <Descriptions.Item label="SubTitle_3" span={2}>{dataViewDetail.subTitle3}</Descriptions.Item>
                        :
                        <></>
                    }
                    {dataViewDetail?.subContent8 ?
                        <Descriptions.Item label="SubContent_8" span={2}>{dataViewDetail.subContent8}</Descriptions.Item>
                        :
                        <></>
                    }
                    {dataViewDetail?.subContent9 ?
                        <Descriptions.Item label="SubContent_9" span={2}>{dataViewDetail.subContent9}</Descriptions.Item>
                        :
                        <></>
                    }
                    {dataViewDetail?.subContent10 ?
                        <Descriptions.Item label="SubContent_10" span={2}>{dataViewDetail.subContent10}</Descriptions.Item>
                        :
                        <></>
                    }
                </Descriptions>
                <Divider orientation="left">Banner</Divider>
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

export default NewsViewDetail;