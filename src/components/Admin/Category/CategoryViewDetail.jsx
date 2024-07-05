import React, { useEffect, useState } from 'react';
import { Badge, Descriptions, Drawer, Upload, Modal, Divider } from 'antd';

const CategoryViewDetail = (props) => {
    const { openViewDetail, setOpenViewDetail } = props;
    const dataViewDetail = props.dataViewDetail;

    useEffect(() => {
        console.log('>>> check data<CategoryViewDetail>: ', dataViewDetail);
    }, [dataViewDetail])

    const onClose = () => {
        setOpenViewDetail(false)
    }

    return (
        <>
            <Drawer title="Chức Năng Xem Chi Tiết"
                width={"50vw"}
                onClose={onClose}
                open={openViewDetail}
            >
                <Descriptions
                    title="Thông tin thể loại"
                    bordered
                    column={2}
                >
                    <Descriptions.Item label="Id" span={2}>{dataViewDetail.id}</Descriptions.Item>
                    <Descriptions.Item label="Trạng Thái Hoạt Động" span={2}>
                        {dataViewDetail?.brandLine?.availableStatus === true ?
                        <Badge status="processing" text="Đang Hoạt Động" />
                        :
                        <Badge status="error" text="Dừng Hoạt Động" />
                    }
                    </Descriptions.Item>
                    <Descriptions.Item label="Thể Loại">{dataViewDetail.categoryName}</Descriptions.Item>
                    <Descriptions.Item label="Dòng Thương Hiệu">{dataViewDetail?.brandLine?.lineName}</Descriptions.Item>
                </Descriptions>
            </Drawer>
        </>
    )
}

export default CategoryViewDetail;