import React, { ReactNode } from 'react';
import { Button, Input, Space } from 'antd';
import { OpenDirectory } from 'wailsjs/go/dialog/Dialog';
import { useSafeState } from 'ahooks';
import { GetFilesInfo } from 'wailsjs/go/file/File';
import { file } from 'wailsjs/go/models';

interface IPathSelectProps {
    value?: string;
    onChange?: (value: string) => void;
    onLoadSuccess?: (files: file.FileInfo[]) => void;
    children?: ReactNode;
}

const PathSelect: React.FC<IPathSelectProps> = (props) => {

    const { value = '', onChange, onLoadSuccess, children } = props;

    const [loading, setLoading] = useSafeState<boolean>(false);

    async function onClick() {
        try {
            const path = await OpenDirectory({} as any);
            onChange?.(path);
        } catch (error) {
            console.log(error);
        }
    }

    async function loadFiles() {
        try {
            setLoading(true);
            const files = await GetFilesInfo(value);
            setLoading(false);
            onLoadSuccess?.(files);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }

    return (
        <>
            <Button onClick={onClick}>
                {children}
            </Button>
            {!!value && (
                <Space.Compact style={{ width: '100%', marginTop: 12 }}>
                    <Input value={value} disabled />
                    <Button
                        loading={loading}
                        onClick={loadFiles}
                    >
                        加载
                    </Button>
                </Space.Compact>
            )}
        </>
    );
};

export default PathSelect;