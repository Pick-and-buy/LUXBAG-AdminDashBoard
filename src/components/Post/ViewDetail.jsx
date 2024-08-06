import { Row, Col, Rate, Divider, Button, Grid } from 'antd';
import { useRef, useState, useEffect } from 'react';
import ImageGallery from 'react-image-gallery';
import ModalGallery from './ModalGallery';
import './post.scss';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { FaShippingFast } from "react-icons/fa";
import { BsCartPlus } from 'react-icons/bs';


const ViewDetail = (props) => {
    const { dataPost } = props;
    const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        console.log('>>> check dataPost: ', dataPost);
        if (dataPost) {
            let productImage = [];
            if (dataPost?.product?.images && dataPost?.product?.images.length > 0) {
                dataPost?.product?.images.map(item => {
                    productImage.push({
                        original: item.imageUrl,
                        thumbnail: item.imageUrl,
                        originalClass: "original-image",
                        thumbnailClass: "thumbnail-image"
                    })
                })
            }
            setFileList(productImage);
        }
    }, [dataPost])

    const refGallery = useRef(null);

    const handleOnClickImage = () => {
        //get current index onClick
        // alert(refGallery?.current?.getCurrentIndex());
        setIsOpenModalGallery(true);
        setCurrentIndex(refGallery?.current?.getCurrentIndex() ?? 0)
        // refGallery?.current?.fullScreen()
    }

    const onChange = (value) => {
        console.log('changed', value);
    };


    return (
        <div style={{ background: '#efefef', padding: "20px 0" }}>
            <div className='view-detail-book' style={{ maxWidth: 1440, margin: '0 auto', minHeight: "calc(100vh - 150px)" }}>
                <div style={{ padding: "20px", background: '#fff', borderRadius: 5 }}>
                    <Row gutter={[20, 20]}>
                        <Col md={10} sm={0} xs={0}>
                            <ImageGallery
                                ref={refGallery}
                                items={fileList}
                                showFullscreenButton={false} //hide fullscreen button
                                renderLeftNav={() => <></>} //left arrow === <> </>
                                renderRightNav={() => <></>}//right arrow === <> </>
                                slideOnThumbnailOver={true}  //onHover => auto scroll imagees
                                onClick={() => handleOnClickImage()}
                            />
                        </Col>
                        <Col md={14} sm={24}>
                            {/* <Col md={0} sm={24} xs={24}>
                                <ImageGallery
                                    ref={refGallery}
                                    items={fileList}
                                    showPlayButton={false} //hide play button
                                    showFullscreenButton={false} //hide fullscreen button
                                    renderLeftNav={() => <></>} //left arrow === <> </>
                                    renderRightNav={() => <></>}//right arrow === <> </>
                                    showThumbnails={false}
                                />
                            </Col> */}
                            <Col span={24}>
                                {/* <div className='author'>Tác giả: <a href='#'>Nguyễn Tiến Thành</a> </div> */}
                                <div className='title-container'>
                                    <div className='title'>{dataPost?.title}</div>
                                    <div className='rating'>
                                        <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 12 }} />
                                    </div>
                                    <div className='price'>
                                        <span className='currency'>
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dataPost?.product?.price)}
                                        </span>
                                    </div>
                                </div>
                                <div className='product-information-container'>
                                    <div className='product-title'>Thông tin chi tiết</div>
                                    <div className='product-details'>
                                        <div className='product-details-container'>
                                            <span className='name'>Người bán</span>
                                            <span>{dataPost?.user?.firstName} {dataPost?.user?.lastName}</span>
                                        </div>
                                        <div className='product-details-container'>
                                            <span className='name'>Tên sản phẩm</span>
                                            <span>{dataPost?.product?.name}</span>
                                        </div>
                                        <div className='product-details-container'>
                                            <span className='name'>Thương hiệu</span>
                                            <span>{dataPost?.product?.brand?.name}</span>
                                        </div>
                                        {dataPost?.product?.brandLine?.lineName &&
                                            <div className='product-details-container'>
                                                <span className='name'>Dòng thương hiệu</span>
                                                <span>{dataPost?.product?.brandLine?.lineName}</span>
                                            </div>
                                        }
                                        {dataPost?.product?.category?.categoryName &&
                                            <div className='product-details-container'>
                                                <span className='name'>Thể loại</span>
                                                <span>{dataPost?.product?.category?.categoryName}</span>
                                            </div>
                                        }
                                        <div className='product-details-container'>
                                            <span className='name'>Tình trạng sản phẩm</span>
                                            <span>{dataPost?.product?.condition}</span>
                                        </div>
                                        {dataPost?.product?.manufactureYear &&
                                            <div className='product-details-container'>
                                                <span className='name'>Năm sản xuất</span>
                                                <span>{dataPost?.product?.manufactureYear}</span>
                                            </div>
                                        }
                                    </div>
                                </div>

                                {dataPost?.description &&
                                    <div className='product-information-container description'>
                                        <div className='product-title'>Mô tả</div>
                                        <span>{dataPost?.description}</span>
                                    </div>
                                }

                                <div className='delivery'>
                                    <div>
                                        <span className='left'>Vận chuyển</span>
                                        <span className='right'><FaShippingFast /> Miễn phí vận chuyển</span>
                                    </div>
                                </div>
                                {/* <div className='quantity'>
                                    <span className='left'>Số lượng</span>
                                    <span className='right'>
                                        <button ><MinusOutlined /></button>
                                        <input defaultValue={1} />
                                        <button><PlusOutlined /></button>
                                    </span>
                                </div>
                                <div className='buy'>
                                    <button className='cart'>
                                        <BsCartPlus className='icon-cart' />
                                        <span>Thêm vào giỏ hàng</span>
                                    </button>
                                    <button className='now'>Mua ngay</button>
                                </div> */}
                            </Col>
                        </Col>
                    </Row>
                </div>
            </div>

            <ModalGallery
                isOpen={isOpenModalGallery}
                setIsOpen={setIsOpenModalGallery}
                currentIndex={currentIndex}
                items={fileList}
                title={dataPost?.title}
            />
        </div>

    )
}

export default ViewDetail;