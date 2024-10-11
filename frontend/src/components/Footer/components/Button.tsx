import React from 'react';
import { Button, ButtonProps } from 'antd';

interface IFootBtnProps extends ButtonProps {
}

const FootBtn: React.FC<IFootBtnProps> = (props) => {

    const { className, ...otherProps } = props;

    return (
        <Button
            className={`hm-footer-button ${className || ''}`}
            {...otherProps}
        />
    );
};

export default FootBtn;