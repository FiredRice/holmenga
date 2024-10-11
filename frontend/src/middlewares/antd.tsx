import { App, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');

const AntdMiddleware = ({ children }) => {

    return (
        <ConfigProvider locale={zhCN}>
            <App>
                {children}
            </App>
        </ConfigProvider>
    );
};

export default AntdMiddleware;