import React, { useEffect, useState } from 'react';
import { Badge, Descriptions, Drawer, Upload, Modal, Divider } from 'antd';
import moment from "moment/moment";

const UserViewDetail = (props) => {
    const { openViewDetail, setOpenViewDetail } = props;
    const dataViewDetail = props.dataViewDetail;

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        console.log('>>> check data view detail user: ', dataViewDetail);
    }, [])

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
                    title="Thông tin người dùng"
                    bordered
                    column={2}
                >
                    <Descriptions.Item label="Tên Đăng Nhập">{dataViewDetail.username}</Descriptions.Item>
                    <Descriptions.Item label="Email">{dataViewDetail.email}</Descriptions.Item>
                    <Descriptions.Item label="Họ">{dataViewDetail.firstName}</Descriptions.Item>
                    <Descriptions.Item label="Tên">{dataViewDetail.lastName}</Descriptions.Item>
                    {/* <Descriptions.Item label="Role" span={2}> */}
                        {/* {dataViewDetail.roles[0].name} */}
                        {/* <Badge status="processing" text={dataViewDetail.roles[0].name} /> */}
                    {/* </Descriptions.Item> */}
                    <Descriptions.Item label="Số Điện Thoại">{dataViewDetail.phoneNumber}</Descriptions.Item>
                    <Descriptions.Item label="Ngày Sinh">
                        {moment(dataViewDetail.dob).format("DD-MM-YYYY")}
                    </Descriptions.Item>
                </Descriptions>
            </Drawer>
        </>
    )
}
export default UserViewDetail;