import React, { useEffect, useMemo, useRef } from 'react';
import { Table, TableProps, Typography, Image, Modal, message } from 'antd';
import LocalImage from '../LocalImage';
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortRow from '../SortRow';
import { Remove } from 'wailsjs/go/file/File';
import dayjs from 'dayjs';
import { SortType, useSorters } from './hooks/useSorter';
import EditableCell from '../EditableCell';
import { FileInfo } from 'src/types';
import config from 'src/service/config';
import './style/index.less';

const Tr: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = (props) => {
    return (
        <tr {...props} />
    );
};

interface IManageTableProps {
    dir?: string;
    value?: FileInfo[];
    onChange?: (value: FileInfo[]) => void;
}

const ManageTable: React.FC<IManageTableProps> = (props) => {

    const { dir = '', value = [], onChange } = props;

    const defaultValue = useRef<FileInfo[]>([]);

    if (defaultValue.current.length !== value.length) {
        defaultValue.current = value;
    }

    const [sorters, sortState] = useSorters<FileInfo>([
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
            return dayjs(value / 1000000).format('YYYY-MM-DD HH:mm:ss');
        }
        return '--';
    }

    function onQuickSort(current: number, target: number) {
        let overIndex = target - 1;
        if (overIndex >= value.length) {
            overIndex = value.length - 1;
        }
        const list = arrayMove(value, current - 1, overIndex);
        onChange?.(list);
        setTimeout(() => {
            const target = document.querySelector(`[data-row-key="${list[overIndex].Name}"]`);
            if (!target) return;
            target.scrollIntoView({
                behavior: config.scrollAnim ? 'smooth' : 'instant' as ScrollBehavior,
                block: 'center'
            });
        }, 0);
    }

    function onRemove(file: FileInfo) {
        Modal.confirm({
            title: '操作提示',
            type: 'warning',
            content: `确认删除图片【${file.Name}】吗？`,
            maskClosable: true,
            onOk: async () => {
                try {
                    await Remove(`${dir}/${file.Name}`);
                    const index = value.findIndex((i) => i.Name === file.Name);
                    const list = [...value];
                    list.splice(index, 1);
                    onChange?.(list);
                    message.success('删除成功');
                } catch (error: any) {
                    message.success(error);
                    console.log(error);
                }
            }
        });
    }

    const columns = useMemo(() => [
        {
            title: '序号',
            key: 'order',
            align: 'center',
            fixed: 'left',
            width: 80,
            render: (_text, _record, index) => (
                <EditableCell onSave={v => onQuickSort(index + 1, v)}>
                    {index + 1}
                </EditableCell>
            )
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
        {
            title: '操作',
            key: 'opt',
            align: 'center',
            fixed: 'right',
            width: 80,
            render: (_, record) => (
                <Typography.Link onClick={() => onRemove(record)}>
                    删除
                </Typography.Link>
            )
        }
    ] as TableProps<FileInfo>['columns'], [value]);

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