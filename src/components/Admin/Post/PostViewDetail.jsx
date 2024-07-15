import React, { useEffect, useState } from 'react';
import { Badge, Descriptions, Drawer, Upload, Modal, Divider } from 'antd';
import moment from "moment/moment";

const PostViewDetail = (props) => {
    const { openViewDetail, setOpenViewDetail } = props;
    const dataViewDetail = props.dataViewDetail;

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        console.log('>>> check data view detail <PostViewDetail>: ', dataViewDetail);
        if (dataViewDetail) {
            let productImage = [];
            if (dataViewDetail?.product?.images && dataViewDetail?.product?.images.length > 0) {
                dataViewDetail?.product?.images.map(item => {
                    productImage.push({
                        uid: item.id,
                        name: dataViewDetail?.product?.name,
                        status: 'done',
                        url: item.imageUrl,
                    })
                })
            }
            setFileList(productImage);
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
            setPreviewTitle(dataViewDetail?.product?.name)
            return;
        }
    };

    return (
        <>
            <Drawer title="Chức Năng Xem Chi Tiết"
                width={"60vw"}
                onClose={onClose}
                open={openViewDetail}
            >
                <Descriptions
                    title="Thông tin bài đăng"
                    bordered
                    column={2}
                >
                    <Descriptions.Item label="Tiêu Đề" span={2} contentStyle={{textAlign: 'center', color: 'blue'}}>{dataViewDetail.title}</Descriptions.Item>
                    <Descriptions.Item label="Tên Sản Phẩm">{dataViewDetail?.product?.name}</Descriptions.Item>
                    <Descriptions.Item label="Người Đăng Bài">{dataViewDetail?.user?.username}</Descriptions.Item>
                    <Descriptions.Item label="Trạng Thái Hoạt Động">
                        {dataViewDetail?.isAvailable === true ?
                            <Badge status="processing" text="Đang Hoạt Động" />
                            :
                            <Badge status="error" text="Dừng Hoạt Động" />
                        }
                    </Descriptions.Item>
                    <Descriptions.Item label="Thương Hiệu">{dataViewDetail?.product?.brand?.name}</Descriptions.Item>
                    <Descriptions.Item label="Dòng Thương Hiệu">{dataViewDetail?.product?.brandLine?.lineName}</Descriptions.Item>
                    <Descriptions.Item label="Thể Loại">{dataViewDetail?.product?.category?.categoryName}</Descriptions.Item>
                    {dataViewDetail?.description ?
                        <Descriptions.Item label="Mô Tả" span={2}>{dataViewDetail?.description}</Descriptions.Item>
                        :
                        <Descriptions.Item label="Mô Tả" span={2} contentStyle={{ textAlign: 'left', color: 'blue' }}>Không có mô tả...</Descriptions.Item>
                    }
                    <Descriptions.Item label="Giá Sản Phẩm" contentStyle={{ textAlign: 'center' }}>{dataViewDetail?.product?.price}</Descriptions.Item>
                    <Descriptions.Item label="Tình Trạng Sản Phẩm" contentStyle={{ textAlign: 'center' }}>{dataViewDetail?.product?.condition}</Descriptions.Item>
                    {dataViewDetail?.product?.size ?
                        <Descriptions.Item label="Kích Thước" contentStyle={{ textAlign: 'center' }}>{dataViewDetail?.product?.size}</Descriptions.Item>
                        :
                        <Descriptions.Item label="Kích Thước" contentStyle={{ textAlign: 'center', color: 'blue' }}>N/A</Descriptions.Item>
                    }
                    {dataViewDetail?.product?.color ?
                        <Descriptions.Item label="Màu Sắc" contentStyle={{ textAlign: 'center' }}>{dataViewDetail?.product?.color}</Descriptions.Item>
                        :
                        <Descriptions.Item label="Màu Sắc" contentStyle={{ textAlign: 'center', color: 'blue' }}>N/A</Descriptions.Item>
                    }
                    {dataViewDetail?.product?.width ?
                        <Descriptions.Item label="Chiều Rộng" contentStyle={{ textAlign: 'center' }}>{dataViewDetail?.product?.width}</Descriptions.Item>
                        :
                        <Descriptions.Item label="Chiều Rộng" contentStyle={{ textAlign: 'center', color: 'blue' }}>N/A</Descriptions.Item>
                    }
                    {dataViewDetail?.product?.height ?
                        <Descriptions.Item label="Chiều Cao" contentStyle={{ textAlign: 'center' }}>{dataViewDetail?.product?.height}</Descriptions.Item>
                        :
                        <Descriptions.Item label="Chiều Cao" contentStyle={{ textAlign: 'center', color: 'blue' }}>N/A</Descriptions.Item>
                    }
                    {dataViewDetail?.product?.length ?
                        <Descriptions.Item label="Chiều Dài" contentStyle={{ textAlign: 'center' }}>{dataViewDetail?.product?.length}</Descriptions.Item>
                        :
                        <Descriptions.Item label="Chiều Dài" contentStyle={{ textAlign: 'center', color: 'blue' }}>N/A</Descriptions.Item>
                    }
                    {dataViewDetail?.product?.referenceCode.toLowerCase() === "none" || dataViewDetail?.product?.referenceCode === "" ?
                        <Descriptions.Item label="Mã Tham Chiếu" contentStyle={{ textAlign: 'center', color: 'blue' }}>N/A</Descriptions.Item>
                        :
                        <Descriptions.Item label="Mã Tham Chiếu" contentStyle={{ textAlign: 'center' }}>{dataViewDetail?.product?.referenceCode}</Descriptions.Item>
                    }
                    {dataViewDetail?.product?.manufactureYear ?
                        <Descriptions.Item label="Năm Sản Xuất" contentStyle={{ textAlign: 'center' }}>{dataViewDetail?.product?.manufactureYear}</Descriptions.Item>
                        :
                        <Descriptions.Item label="Năm Sản Xuất" contentStyle={{ textAlign: 'center', color: 'blue' }}>N/A</Descriptions.Item>
                    }
                    {dataViewDetail?.product?.exteriorMaterial.toLowerCase() === "none" || dataViewDetail?.product?.exteriorMaterial === "" ?
                        <Descriptions.Item label="Chất Liệu Bên Ngoài" contentStyle={{ textAlign: 'center', color: 'blue' }}>N/A</Descriptions.Item>
                        :
                        <Descriptions.Item label="Chất Liệu Bên Ngoài" contentStyle={{ textAlign: 'center' }}>{dataViewDetail?.product?.exteriorMaterial}</Descriptions.Item>
                    }
                    {dataViewDetail?.product?.accessories.toLowerCase() === "none" || dataViewDetail?.product?.accessories === "" ?
                        <Descriptions.Item label="Phụ Kiện" contentStyle={{ textAlign: 'center', color: 'blue' }}>N/A</Descriptions.Item>
                        :
                        <Descriptions.Item label="Phụ Kiện" contentStyle={{ textAlign: 'center' }}>{dataViewDetail?.product?.accessories}</Descriptions.Item>
                    }
                    {dataViewDetail?.product?.interiorMaterial.toLowerCase() === "none" || dataViewDetail?.product?.interiorMaterial === "" ?
                        <Descriptions.Item label="Chất Liệu Bên Trong" contentStyle={{ textAlign: 'center', color: 'blue' }}>N/A</Descriptions.Item>
                        :
                        <Descriptions.Item label="Chất Liệu Bên Trong" contentStyle={{ textAlign: 'center' }}>{dataViewDetail?.product?.interiorMaterial}</Descriptions.Item>
                    }
                    {dataViewDetail?.product?.dateCode.toLowerCase() === "none" || dataViewDetail?.product?.dateCode === "" ?
                        <Descriptions.Item label="Date Code" contentStyle={{ textAlign: 'center', color: 'blue' }}>N/A</Descriptions.Item>
                        :
                        <Descriptions.Item label="Date Code" contentStyle={{ textAlign: 'center' }}>{dataViewDetail?.product?.dateCode}</Descriptions.Item>
                    }
                    {dataViewDetail?.product?.serialNumber.toLowerCase() === "none" || dataViewDetail?.product?.serialNumber === "" ?
                        <Descriptions.Item label="Serial Number" contentStyle={{ textAlign: 'center', color: 'blue' }}>N/A</Descriptions.Item>
                        :
                        <Descriptions.Item label="Serial Number" contentStyle={{ textAlign: 'center' }}>{dataViewDetail?.product?.serialNumber}</Descriptions.Item>
                    }
                    {dataViewDetail?.product?.purchasedPlace ?
                        <Descriptions.Item label="Nơi Mua" contentStyle={{ textAlign: 'center' }}>{dataViewDetail?.product?.purchasedPlace}</Descriptions.Item>
                        :
                        <Descriptions.Item label="Nơi Mua" contentStyle={{ textAlign: 'center', color: 'blue' }}>N/A</Descriptions.Item>
                    }
                </Descriptions>
                <Divider orientation="left">Ảnh Sản Phẩm</Divider>
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

export default PostViewDetail;