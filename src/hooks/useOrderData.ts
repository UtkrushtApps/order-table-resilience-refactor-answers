import { useEffect, useRef, useState } from 'react';
import { fetchOrders, fetchOrderSummary } from '../services/ordersApi';
import { useFailureMode } from '../context/FailureModeContext';
import type { Order, OrderFilters, OrderSummary } from '../types';

interface OrderDataState {
  orders: Order[];
  totalCount: number;
  summary: OrderSummary | null;
  loading: boolean;
  error: string | null;
}

function isAbortError(error: unknown): boolean {
  return (
    error instanceof DOMException && error.name === 'AbortError'
  ) || (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    (error as { name?: string }).name === 'AbortError'
  );
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Failed to load order data.';
}

export function useOrderData(filters: OrderFilters): OrderDataState {
  const failureMode = useFailureMode();
  const requestIdRef = useRef(0);

  const [orders, setOrders] = useState<Order[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [summary, setSummary] = useState<OrderSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const requestId = ++requestIdRef.current;

    setLoading(true);
    setError(null);

    fetchOrders(filters, failureMode, controller.signal)
      .then(result => {
        if (requestId !== requestIdRef.current || controller.signal.aborted) {
          return;
        }

        setOrders(result.orders);
        setTotalCount(result.totalCount);
      })
      .catch(error => {
        if (isAbortError(error) || requestId !== requestIdRef.current || controller.signal.aborted) {
          return;
        }

        setError(getErrorMessage(error));
      })
      .finally(() => {
        if (requestId !== requestIdRef.current || controller.signal.aborted) {
          return;
        }

        setLoading(false);
      });

    fetchOrderSummary(filters, failureMode, controller.signal)
      .then(result => {
        if (requestId !== requestIdRef.current || controller.signal.aborted) {
          return;
        }

        setSummary(result);
      })
      .catch(error => {
        if (isAbortError(error) || requestId !== requestIdRef.current || controller.signal.aborted) {
          return;
        }

        setError(prev => prev ?? getErrorMessage(error));
      });

    return () => {
      controller.abort();
    };
  }, [filters.page, filters.query, filters.status, failureMode]);

  return { orders, totalCount, summary, loading, error };
}
