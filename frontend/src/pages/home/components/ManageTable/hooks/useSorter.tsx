import { isEmpty } from 'lodash';
import { useMemo, useState } from 'react';

export enum SortType {
    /**升序 */
    asce = 1,
    /**降序 */
    desc = 2,
    /**默认 */
    default = 3
}

type IOptions = {
    sortType: number,
    onSortChange?: (sortType: number) => void;
};

const SortTypeMap = {
    [SortType.default]: {
        tip: '点击升序',
        nextValue: SortType.asce
    },
    [SortType.asce]: {
        tip: '点击降序',
        nextValue: SortType.desc
    },
    [SortType.desc]: {
        tip: '点击取消',
        nextValue: SortType.default
    }
};

export const useSorter = (options: IOptions) => {
    const { sortType, onSortChange } = options;
    return {
        sorter: true,
        sortOrder: sortType === SortType.default ? false : sortType === SortType.desc ? 'descend' : 'ascend',
        showSorterTooltip: {
            title: SortTypeMap[sortType].tip,
        },
        onHeaderCell: (column) => {
            return {
                onClick: () => {
                    onSortChange?.(SortTypeMap[sortType].nextValue);
                }
            };
        }
    };
};

export type ISortersType<T = any> = {
    [P in keyof T]: ReturnType<typeof useSorter>;
};

export type ISorterState = {
    orderField: string;
    orderType: SortType;
};

/**
 * 根据传入的列名生成该列的排序对象
 * @param columnKeys 列名数组
 * @param defaultValue columnKeys[0] 的默认值，也即整个表格的初始排序方式，默认不排序
 * @returns [sorters: 表格列的排序对象, sorterState: 表格列的排序字段和方式]
 */
export function useSorters<T extends Object = any>(columnKeys: (keyof T)[], defaultValue: SortType = SortType.default): [ISortersType<T>, ISorterState] {
    const [state, setState] = useState({
        orderField: isEmpty(columnKeys) ? '' : columnKeys[0] as string,
        orderType: defaultValue
    });

    const sorters = useMemo(() => {
        const sorterMap = {} as ISortersType<T>;
        columnKeys.forEach(key => {
            sorterMap[key] = useSorter({
                sortType: state.orderField === key ? state.orderType : SortType.default,
                onSortChange: value => setState({
                    orderField: key as string,
                    orderType: value
                })
            });
        });
        return sorterMap;
    }, [state]);

    return [sorters, state];
};