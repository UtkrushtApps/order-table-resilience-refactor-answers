import React, { useCallback, useMemo, useState } from 'react';
import SearchBox from '../components/SearchBox';
import StatusFilter from '../components/StatusFilter';
import SummaryBar from '../components/SummaryBar';
import OrderTable from '../components/OrderTable';
import Pagination from '../components/Pagination';
import { useOrderData } from '../hooks/useOrderData';
import type { OrderFilters, OrderStatus } from '../types';

const PAGE_SIZE = 50;

const OrderTablePage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<OrderStatus | ''>('');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filters: OrderFilters = useMemo(
    () => ({ query, status, page }),
    [query, status, page]
  );

  const { orders, totalCount, summary, loading, error } = useOrderData(filters);

  const onSelectRow = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);
    setPage(1);
  }, []);

  const handleStatusChange = useCallback((value: OrderStatus | '') => {
    setStatus(value);
    setPage(1);
  }, []);

  return (
    <div>
      <SummaryBar summary={summary} loading={loading} />

      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <SearchBox value={query} onChange={handleQueryChange} />
        <StatusFilter value={status} onChange={handleStatusChange} />
        {loading && (
          <span style={{ fontSize: '13px', color: '#6b7280' }} role="status" aria-live="polite">
            Loading…
          </span>
        )}
        {error && (
          <span style={{ fontSize: '13px', color: '#ef4444' }} role="alert">
            {error}
          </span>
        )}
      </div>

      <OrderTable
        orders={orders}
        selectedIds={selectedIds}
        onSelectRow={onSelectRow}
        loading={loading}
      />

      <Pagination
        page={page}
        totalCount={totalCount}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />
    </div>
  );
};

export default OrderTablePage;
