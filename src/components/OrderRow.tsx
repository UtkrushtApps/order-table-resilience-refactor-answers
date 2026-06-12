import React from 'react';
import type { Order } from '../types';
import { formatCurrency, formatDate, statusColor } from '../utils/formatters';

interface OrderRowProps {
  order: Order;
  isSelected: boolean;
  onSelectRow: (id: string) => void;
}

const OrderRow: React.FC<OrderRowProps> = ({ order, isSelected, onSelectRow }) => {
  return (
    <tr
      style={{
        background: isSelected ? '#eff6ff' : '#fff',
        borderBottom: '1px solid #f3f4f6',
        cursor: 'pointer',
      }}
      onClick={() => onSelectRow(order.id)}
      aria-selected={isSelected}
    >
      <td style={cellStyle}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelectRow(order.id)}
          aria-label={`Select order ${order.id}`}
          onClick={e => e.stopPropagation()}
        />
      </td>
      <td style={{ ...cellStyle, fontFamily: 'monospace', fontSize: '13px' }}>{order.id}</td>
      <td style={cellStyle}>{order.customerName}</td>
      <td style={{ ...cellStyle, fontSize: '12px', color: '#6b7280' }}>{order.customerEmail}</td>
      <td style={cellStyle}>
        <span
          style={{
            display: 'inline-block',
            padding: '2px 8px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: 600,
            background: statusColor(order.status) + '22',
            color: statusColor(order.status),
          }}
        >
          {order.status}
        </span>
      </td>
      <td style={{ ...cellStyle, textAlign: 'right' }}>{formatCurrency(order.total)}</td>
      <td style={{ ...cellStyle, textAlign: 'center' }}>{order.itemCount}</td>
      <td style={{ ...cellStyle, fontSize: '12px', color: '#6b7280' }}>{formatDate(order.createdAt)}</td>
      <td style={{ ...cellStyle, fontSize: '12px' }}>{order.region}</td>
    </tr>
  );
};

const cellStyle: React.CSSProperties = {
  padding: '10px 12px',
  fontSize: '14px',
  verticalAlign: 'middle',
};

export default React.memo(OrderRow);
