import React, { ReactNode } from 'react';
import { Card, Typography } from 'antd';
import './style/index.less'

interface IHeaderProps {
    children?: ReactNode;
}

const Header: React.FC<IHeaderProps> = (props) => {

    const { children } = props;

    return (
        <Card className='hm-page-head'>
            <Typography.Title level={4}>
                {children}
            </Typography.Title>
        </Card>
    );
};

export default Header;