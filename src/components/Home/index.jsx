import { useEffect, useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { FilterTwoTone, ReloadOutlined } from '@ant-design/icons';
import { Row, Col, Form, Spin, Checkbox, Divider, InputNumber, Button, Rate, Tabs, Pagination } from 'antd';
import './home.scss';
import { callFetchListBrands } from '../../services/brand';
import { callFetchListPosts } from '../../services/post';
import Header from '../Header';

const Home = () => {
    const [listPosts, setListPosts] = useState([]);
    const [listBrand, setListBrand] = useState([]);

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);

    const [isLoading, setIsLoading] = useState(false);

    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort=-updatedAt");
    const [searchQuery, setSearchQuery] = useState('');

    const [form] = Form.useForm();
    const navigate = useNavigate();

    const fetchBrand = async () => {
        const res = await callFetchListBrands();
        if (res && res.result) {
            const brand = res.result.brands.map(item => {
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
            if (sortQuery === 'sort=price') {
                posts.sort((a, b) => (a.product.price ?? 0) - (b.product.price ?? 0));
            } else if (sortQuery === 'sort=-price') {
                posts.sort((a, b) => (b.product.price ?? 0) - (a.product.price ?? 0));
            } else if (sortQuery === 'sort=-updatedAt') {
                posts.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            }

            // Filter by Brand Name
            if (filter.brand && filter.brand.length > 0) {
                // posts = posts.filter((post) => filter.brand.includes(post.product.brand.name));

                posts = posts.filter((post) => {
                    return post.product && post.product.brand && filter.brand.includes(post.product.brand.name);
                });
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
        console.log('>>> check filter, ', filter);
        
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

    const nonAccentVietnamese = (str) => {
        str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, "A");
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, "E");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/I|Í|Ì|Ĩ|Ị/g, "I");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, "O");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, "U");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, "Y");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/Đ/g, "D");
        str = str.replace(/đ/g, "d");
        // Some system encode vietnamese combining accent as individual utf-8 characters
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
        return str;
    }

    //js convert slug: https://stackoverflow.com/questions/1053902/how-to-convert-a-title-to-a-url-slug-in-jquery
    const convertSlug = (str) => {
        str = nonAccentVietnamese(str);
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();

        // remove accents, swap ñ for n, etc
        const from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆĞÍÌÎÏİŇÑÓÖÒÔÕØŘŔŠŞŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇğíìîïıňñóöòôõøðřŕšşťúůüùûýÿžþÞĐđßÆa·/_,:;";
        const to = "AAAAAACCCDEEEEEEEEGIIIIINNOOOOOORRSSTUUUUUYYZaaaaaacccdeeeeeeeegiiiiinnooooooorrsstuuuuuyyzbBDdBAa------";
        for (let i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes

        return str;
    }

    const handleRedirectPostDetailPage = (post) => {
        const slug = convertSlug(post.title);
        navigate(`/post/${slug}?id=${post.id}`)
    }

    return (
        <>
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
                                    {listPosts.length > 0 ?
                                        <div>
                                            <Row className='customize-row'>
                                                {listPosts?.map((item, index) => {
                                                    return (
                                                        <div className="column" key={index} onClick={() => handleRedirectPostDetailPage(item)}>
                                                            <div className='wrapper'>
                                                                <div className='thumbnail'>
                                                                    <img
                                                                        key={item?.product?.images[0]?.id}
                                                                        style={{ height: 150, width: 200 }}
                                                                        src={item?.product?.images[0]?.imageUrl}
                                                                        alt="thumbnail post" />
                                                                </div>
                                                                <div className='text' title={item.title}>{item.title}</div>
                                                                <div className='brand'>
                                                                    Thương hiệu: {item?.product?.brand?.name}
                                                                </div>
                                                                <div className='price'>
                                                                    Giá tiền: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item?.product?.price ?? 0)}
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
                                        :
                                        <div className='not-found-post'>
                                            Không tìm thấy dữ liệu
                                        </div>
                                    }
                                </div>
                            </Spin>
                        </Col>
                    </Row>
                </div>
            </div>
            {/* <Header
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            /> */}
        </>
    )
}

export default Home;