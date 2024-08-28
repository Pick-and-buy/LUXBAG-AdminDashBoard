import React, { useState, useEffect } from "react";
import { Statistic, Card, Row, Col } from 'antd';
import { PieChart } from 'react-minimal-pie-chart';
import './adminDashboard.scss';
import { totalAmountPerWeek, totalAmountPerMonth, totalAmountPerYear } from './../../services/statistic';

const AdminDashboard = () => {
    const [listData, setListData] = useState([]);

    useEffect(() => {
        fetchListData();
    }, [])

    const fetchListData = async () => {
        const res_week = await totalAmountPerWeek();
        const res_month = await totalAmountPerMonth();
        const res_year = await totalAmountPerYear();
        
        // Cập nhật state listData với các giá trị từ API
        setListData([
            { title: 'Tuần', value: res_week.result, color: '#1890ff' },
            { title: 'Tháng', value: res_month.result, color: '#52c41a' },
            { title: 'Năm', value: res_year.result, color: '#f5222d' },
        ]);
    }

    return (
        <>
            <div className="statistics-container">
                <Row gutter={16} justify="center">
                    {listData.map((item, index) => (
                        <Col key={index} span={8}>
                            <Card>
                                <Statistic
                                    title={`Số tiền trung bình trong 1 ${item.title}`}
                                    value={item.value}
                                    prefix="VND"
                                    valueStyle={{ color: item.color }}
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>
                <div className="chart-container">
                    <PieChart
                        data={listData}
                        animate
                        label={({ dataEntry }) => `${Math.round(dataEntry.percentage)} %`}
                        labelStyle={{ 
                            fontSize: '6px',
                            fontWeight: 'bold',
                            fill: '#000',
                            textAnchor: 'middle',          // Đảm bảo nhãn được căn giữa ngang
                            dominantBaseline: 'central',   // Đảm bảo nhãn được căn giữa dọc

                        }}
                        radius={42}    // Điều chỉnh bán kính để nhãn nằm chính xác ở trung tâm
                        lineWidth={50}  // Điều chỉnh độ dày của đường tròn
                        labelPosition={70}  // Điều chỉnh vị trí nhãn để đảm bảo chúng nằm đúng trung tâm
                        segmentsShift={1}   // Dịch chuyển nhẹ các phần để tạo khoảng cách giữa chúng
                        style={{ width: '300px', height: '300px' }}  // Đảm bảo SVG có tỉ lệ 1:1
                    />
                </div>
            </div>
        </>
    )
}

export default AdminDashboard;