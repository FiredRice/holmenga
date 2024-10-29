import React, { useMemo, useState } from 'react';
import { Card, Flex, Form, Image, Drawer, DrawerProps, Select } from 'antd';
import { file } from 'wailsjs/go/models';
import LocalImage from '../LocalImage';
import './style/index.less';

interface IQuickPreviewProps extends DrawerProps {
}

const QuickPreview: React.FC<IQuickPreviewProps> = React.memo((props) => {

    const { ...otherProps } = props;

    const [columnNum, setColumnNum] = useState<number>(3);

    const cardWidth = useMemo(() => {
        return `calc((100% - ${(columnNum - 1) * 12}px) / ${columnNum})`;
    }, [columnNum]);

    const dir = Form.useWatch('dir') || '';
    const images: file.FileInfo[] = Form.useWatch('images') || [];

    return (
        <Drawer
            title='快速预览'
            placement='left'
            width='80%'
            extra={
                <Select
                    value={columnNum}
                    onChange={setColumnNum}
                    options={[
                        { label: '3 列', value: 3 },
                        { label: '4 列', value: 4 },
                        { label: '5 列', value: 5 },
                        { label: '6 列', value: 6 },
                    ]}
                />
            }
            {...otherProps}
        >
            <Image.PreviewGroup
                preview
                items={images.map(f => `wails-local/${dir}/${f.Name}`)}
            >
                <Flex wrap gap={12}>
                    {images.map((v, i) => (
                        <Card
                            key={v.Name}
                            className='prev-card'
                            style={{ width: cardWidth }}
                            hoverable
                            cover={<LocalImage src={`${dir}/${v.Name}`} />}
                        >
                            <Card.Meta className='tc' title={i + 1} />
                        </Card>
                    ))}
                </Flex>
            </Image.PreviewGroup>
        </Drawer>
    );
});

export default QuickPreview;