import React, { ReactNode } from 'react';
import { Affix } from 'antd';

interface IContainerProps {
    children?: ReactNode;
}

const Container: React.FC<IContainerProps> = (props) => {

    const { children } = props;

    return (
        <Affix offsetBottom={0}>
            <div className='hm-footer'>
                <div className='hm-footer-content'>
                    {children}
                </div>
            </div>
        </Affix>
    );
};

export default Container;