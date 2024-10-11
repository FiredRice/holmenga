import Container from './components/Container';
import Button from './components/Button';
import './style/index.less';

type IContainerProps = typeof Container;

interface IFooterProps extends IContainerProps {
    Button: typeof Button;
}

const Footer = Container as IFooterProps;

Footer.Button = Button;

export default Footer;