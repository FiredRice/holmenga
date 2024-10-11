import React, { ReactNode } from 'react';
import { Flex } from 'antd';

interface IPageProps {
    children?: ReactNode;
}

const Page: React.FC<IPageProps> = (props) => {

    const { children } = props;

    return (
        <Flex
            vertical
            gap={8}
        >
            {children}
        </Flex>
    );
};

export default Page;