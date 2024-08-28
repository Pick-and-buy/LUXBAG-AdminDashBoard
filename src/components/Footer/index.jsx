import './footer.scss';

const Footer = () => {
    return (
        <div className='footer-container'>
            <div>
                Giá Tốt ©{new Date().getFullYear()}
            </div>
        </div>
    )
}

export default Footer;