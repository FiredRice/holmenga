import React, { useEffect, useMemo, useRef } from 'react';
import { Table, TableProps, Typography, Image } from 'antd';
import LocalImage from '../LocalImage';
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortRow from '../SortRow';
import { file } from 'wailsjs/go/models';
import dayjs from 'dayjs';
import { SortType, useSorters } from './hooks/useSorter';
import './style/index.less';

const Tr: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = (props) => {
    return (
        <tr {...props} />
    );
};

interface IManageTableProps {
    dir?: string;
    value?: file.FileInfo[];
    onChange?: (value: file.FileInfo[]) => void;
}

const ManageTable: React.FC<IManageTableProps> = (props) => {

    const { dir = '', value = [], onChange } = props;

    const defaultValue = useRef<file.FileInfo[]>([]);

    if (defaultValue.current.length !== value.length) {
        defaultValue.current = value;
    }

    const [sorters, sortState] = useSorters<file.FileInfo>([
        'Name', 
        'ModTime',
        'CreationTime',
        'LastAccessTime'
    ]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 1,
            },
        }),
    );

    const onDragEnd = ({ active, over }: DragEndEvent) => {
        if (active.id !== over?.id) {
            const activeIndex = value.findIndex((i) => i.Name === active.id);
            const overIndex = value.findIndex((i) => i.Name === over?.id);
            onChange?.(arrayMove(value, activeIndex, overIndex));
        }
    };

    function millisecondsFormat(value: number) {
        if (!!value) {
            return dayjs(value / 1000000).format('YYYY-MM-DD HH:mm:ss')
        }
        return '--'
    }

    const columns = useMemo(() => [
        {
            title: '序号',
            key: 'order',
            align: 'center',
            fixed: 'left',
            width: 80,
            render: (_text, _record, index) => index + 1
        },
        {
            title: '名称',
            dataIndex: 'Name',
            align: 'center',
            width: 200,
            className: 'col-name',
            ...sorters.Name,
            render: (text: string) => (
                <div className='col-name-cell'>
                    <LocalImage
                        src={`${dir}/${text}`}
                        width={100}
                        height={100}
                    />
                    <Typography.Text
                        className='col-name-cell__text'
                        ellipsis
                    >
                        {text}
                    </Typography.Text>
                </div>
            )
        },
        {
            title: '修改时间',
            dataIndex: 'ModTime',
            align: 'center',
            ...sorters.ModTime,
            width: 160,
            render: (text) => dayjs(text * 1000).format('YYYY-MM-DD HH:mm:ss')
        },
        {
            title: '创建时间',
            dataIndex: 'CreationTime',
            align: 'center',
            ...sorters.CreationTime,
            width: 160,
            render: millisecondsFormat
        },
        {
            title: '最后接收时间',
            dataIndex: 'LastAccessTime',
            align: 'center',
            ...sorters.LastAccessTime,
            width: 160,
            render: millisecondsFormat
        },
    ] as TableProps<file.FileInfo>['columns'], [dir, sorters]);

    useEffect(() => {
        const { orderField, orderType } = sortState;
        if (orderType === SortType.default) {
            onChange?.(defaultValue.current);
            return;
        }
        const list = [...value];
        if (orderField === 'Name') {
            if (orderType === SortType.asce) {
                onChange?.(list.sort((a, b) => a.Name.localeCompare(b.Name)));
                return;
            }
            if (orderType === SortType.desc) {
                onChange?.(list.sort((a, b) => b.Name.localeCompare(a.Name)));
                return;
            }
        } else {
            if (orderType === SortType.asce) {
                onChange?.(list.sort((a, b) => a[orderField] - b[orderField]));
                return;
            }
            if (orderType === SortType.desc) {
                onChange?.(list.sort((a, b) => b[orderField] - a[orderField]));
                return;
            }
        }
    }, [sortState]);

    return (
        <DndContext sensors={sensors} modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
            <SortableContext
                items={value.map(i => i.Name)}
                strategy={verticalListSortingStrategy}
            >
                <Image.PreviewGroup
                    preview
                    items={value.map(f => `wails-local/${dir}/${f.Name}`)}
                >
                    <Table
                        rowKey='Name'
                        className='manage-table'
                        size='small'
                        components={{
                            body: { row: !!value.length ? SortRow : Tr }
                        }}
                        columns={columns}
                        dataSource={value}
                        pagination={false}
                        scroll={{ x: 'max-content' }}
                    />
                </Image.PreviewGroup>
            </SortableContext>
        </DndContext>
    );
};

export default ManageTable;