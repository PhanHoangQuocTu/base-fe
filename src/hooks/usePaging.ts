'use client';

import { useState } from 'react';

import type { IPaging } from '@/types';

interface State<T extends object = any> {
  paging: IPaging;
  filter: T;
}

const usePaging = <T extends object>(limit: number, initFilter: T) => {
  const [state, setState] = useState<State<T>>({
    paging: {
      limit,
      page: 1,
      total: 0,
    },
    filter: initFilter,
  });

  const onTotalItemsChange = (totalItems: number) => {
    setState((pre) => ({
      ...pre,
      paging: {
        ...pre.paging,
        total: totalItems,
      },
    }));
  };

  const onPageChange = (currentPage: number) => {
    setState((pre) => ({
      ...pre,
      paging: {
        ...pre.paging,
        page: currentPage,
      },
    }));
  };

  const onPageSizeChange = (currentSize: number) => {
    setState((pre) => ({
      ...pre,
      paging: {
        ...pre.paging,
        limit: currentSize,
      },
    }));
  };

  const onFilterChange = <TKey extends keyof T>(key: TKey, value: T[TKey]) => {
    setState((pre) => ({
      ...pre,
      filter: {
        ...pre.filter,
        [key]: Array.isArray(value) ? (value as unknown as any[]).join(',') : value,
      },
    }));
  };

  const onFilter = (values: T) => {
    (Object.keys(values) as (keyof typeof values)[]).forEach((key) => {
      onFilterChange(key, values[key]);
    });
    onPageChange(1);
  };

  const onResetFilter = () => {
    setState((pre) => ({
      ...pre,
      paging: {
        ...pre.paging,
        page: 1,
        limit,
      },
      filter: initFilter,
    }));
  };

  return {
    paging: state.paging,
    filter: state.filter,
    onPageChange,
    onPageSizeChange,
    onTotalItemsChange,
    onFilterChange,
    onFilter,
    onResetFilter,
  };
};

export default usePaging;
