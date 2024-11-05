import React, { ReactNode } from 'react';
import { Button, Input, message, Space } from 'antd';
import { OpenDirectory } from 'wailsjs/go/dialog/Dialog';
import { useSafeState } from 'ahooks';
import { PathExists, Dir } from 'wailsjs/go/path/Path';
import { GetFilesInfo } from 'wailsjs/go/file/File';
import { FileInfo } from 'src/types';

interface IPathSelectProps {
    value?: string;
    onChange?: (value: string) => void;
    onLoadSuccess?: (files: FileInfo[]) => void;
    children?: ReactNode;
}

const PathSelect: React.FC<IPathSelectProps> = (props) => {

    const { value = '', onChange, onLoadSuccess, children } = props;

    const [loading, setLoading] = useSafeState<boolean>(false);

    async function getDefaultPath(path: string) {
        let p = path.replaceAll('\\', '/');
        while (!!p) {
            try {
                const exist = await PathExists(p);
                if (exist) {
                    return p;
                }
                p = await Dir(p);
            } catch (error) {
                console.log(error);
                return '';
            }
        }
        return p;
    }

    async function onClick() {
        try {
            const defaultPath = await getDefaultPath(value);
            const path = await OpenDirectory({
                DefaultDirectory: defaultPath || undefined
            } as any);
            onChange?.(path);
        } catch (error: any) {
            message.error(error);
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