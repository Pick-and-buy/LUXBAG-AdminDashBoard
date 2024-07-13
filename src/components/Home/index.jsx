import { useEffect, useState } from 'react';
import { FilterTwoTone, ReloadOutlined } from '@ant-design/icons';
import { Row, Col, Form, Spin, Checkbox, Divider, InputNumber, Button, Rate, Tabs, Pagination } from 'antd';
import './home.scss';
import { callFetchListBrands } from '../../services/brand';
import { callFetchListPosts } from '../../services/post';

const Home = () => {
    const [listPosts, setListPosts] = useState([]);
    const [listBrand, setListBrand] = useState([]);

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);

    const [isLoading, setIsLoading] = useState(false);

    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort=-updatedAt");

    const [form] = Form.useForm();

    const fetchBrand = async () => {
        const res = await callFetchListBrands();
        if (res && res.result) {
            const brand = res.result.map(item => {
                return {
                    label: item.name,
                    value: item.name
                }
            })
            setListBrand(brand);
        }
    }

    const fetchPost = async () => {
        setIsLoading(true);
        const res = await callFetchListPosts();
        if (res && res.result) {
            let posts = [...res.result];
            if(sortQuery === 'sort=price') {
                posts.sort((a, b) => (a.product.price ?? 0) - (b.product.price ?? 0));
            } else if(sortQuery === 'sort=-price'){
                posts.sort((a, b) => (b.product.price ?? 0) - (a.product.price ?? 0));
            } else if (sortQuery === 'sort=-updatedAt') {
                posts.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            }

            // Filter by Brand Name
            if (filter.brand && filter.brand.length > 0) {
                posts = posts.filter((post) => filter.brand.includes(post.product.brand.name));
            } 

            const start = (current - 1) * pageSize;
            const end = current * pageSize;
            setListPosts(posts.slice(start, end));
            //pagination
            setTotal(posts.length);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        fetchBrand();
    }, []);

    useEffect(() => {
        fetchPost();
    }, [current, pageSize, filter, sortQuery]);

    const handleChangeFilter = (changedValues, values) => {
        console.log(">>> check handleChangeFilter", changedValues, values)
    }

    const onFinish = (values) => {
        setFilter(values);
        setCurrent(1); // Reset current page to 1 when applying filter
    }

    const handleOnchangePage = (pagination) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1)
        }
    }

    const items = [
        // {
        //     key: "1",
        //     label: `Lượt Yêu Thích`,
        //     children: <></>,
        // },
        {
            key: 'sort=-updatedAt',
            label: `Hàng Mới`,
            children: <></>,
        },
        {
            key: 'sort=price',
            label: `Giá Thấp Đến Cao`,
            children: <></>,
        },
        {
            key: 'sort=-price',
            label: `Giá Cao Đến Thấp`,
            children: <></>,
        },
    ];

    return (
        <div style={{ background: '#efefef', padding: "20px 0" }}>
            <div className="homepage-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
                <Row gutter={[20, 20]}>
                    <Col md={4} sm={0} xs={0}>
                        <div style={{ padding: "20px", background: '#fff', borderRadius: 5 }}>
                            <div style={{ display: 'flex', justifyContent: "space-between" }}>
                                <span> <FilterTwoTone />
                                    <span style={{ fontWeight: 500 }}> Bộ lọc tìm kiếm</span>
                                </span>
                                <ReloadOutlined title="Reset" onClick={() => {
                                    form.resetFields();
                                    setFilter('');
                                }} 
                                />
                            </div>
                            <Divider />
                            <Form
                                onFinish={onFinish}
                                form={form}
                                onValuesChange={(changedValues, values) => handleChangeFilter(changedValues, values)}
                            >
                                <Form.Item
                                    name="brand"
                                    label="Danh mục sản phẩm"
                                    labelCol={{ span: 24 }}
                                >
                                    <Checkbox.Group>
                                        <Row>
                                            {listBrand?.map((item, index) => {
                                                return (
                                                    <Col span={24} key={`index-${index}`} style={{ padding: '7px 0' }}>
                                                        <Checkbox value={item.value} >
                                                            {item.label}
                                                        </Checkbox>
                                                    </Col>
                                                )
                                            })}
                                        </Row>
                                    </Checkbox.Group>
                                </Form.Item>
                                <Divider />
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                >
                                    <div>
                                        <Button onClick={() => form.submit()}
                                            style={{ width: "100%" }} type='primary'>Áp dụng</Button>
                                    </div>
                                </Form.Item>
                            </Form>
                        </div>
                    </Col>
                    <Col md={20} xs={24} >
                        <Spin spinning={isLoading} tip="Loading...">
                            <div style={{ padding: "20px", background: '#fff', borderRadius: 5 }}>
                                <Row >
                                    <Tabs
                                        defaultActiveKey="sort=-updatedAt"
                                        items={items}
                                        onChange={(value) => { setSortQuery(value) }}
                                        style={{ overflowX: "auto" }}
                                    />
                                </Row>
                                <Row className='customize-row'>
                                    {listPosts?.map((item, index) => {
                                        return (
                                            <div className="column" key={index}>
                                                <div className='wrapper'>
                                                    <div className='thumbnail'>
                                                        <img
                                                            key={item?.product?.images[0]?.id}
                                                            style={{ height: 150, width: 200 }}
                                                            src={item?.product?.images[0]?.imageUrl}
                                                            alt="thumbnail post" />
                                                    </div>
                                                    <div className='text' title={item.title}>{item.title}</div>
                                                    <div className='price'>
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item?.product?.price ?? 0)}
                                                    </div>
                                                    <div className='rating'>
                                                        <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </Row>
                                <div style={{ marginTop: 30 }}></div>
                                <Row style={{ display: "flex", justifyContent: "center" }}>
                                    <Pagination
                                        current={current}
                                        total={total}
                                        pageSize={pageSize}
                                        responsive
                                        onChange={(p, s) => handleOnchangePage({ current: p, pageSize: s })}
                                        showTotal={(total, range) => {
                                            return (
                                                <div>
                                                    {range[0]} - {range[1]} trên {total} rows
                                                </div>
                                            )
                                        }}
                                    />
                                </Row>
                            </div>
                        </Spin>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default Home;