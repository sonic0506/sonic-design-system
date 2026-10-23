'use client';
import { useState } from 'react';
import { DataGrid, Pagination, Switch, type DataGridColumn } from '@xonic0506/sonic-ui';

type Key = { id: string; name: string; requests: number; status: string; createdAt: string };
const KEYS: Key[] = Array.from({ length: 25 }, (_, i) => ({ id: `k${i + 1}`, name: `key-${i + 1}`, requests: (i * 7919) % 20000, status: i % 3 ? 'active' : 'paused', createdAt: '2026-10-21' }));

// columns에 함수가 들어 있어서 DataGrid는 클라이언트 컴포넌트에서 정의해요
export function Grid() {
  const [rows, setRows] = useState(KEYS);
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(3);
  const [refreshing, setRefreshing] = useState(false);
  const columns: DataGridColumn<Key>[] = [
    { field: 'name', header: '이름', type: 'text', pinned: 'left', width: 160, sortable: true },
    { field: 'requests', header: '요청 수', type: 'number', sortable: true },
    { field: 'status', header: '상태', type: 'badge', tones: { active: 'success', paused: 'warning' }, labels: { active: '활성', paused: '일시 정지' } },
    { field: 'createdAt', header: '만든 날', type: 'date' },
  ];
  return (
    <div className="w-180 flex flex-col gap-4">
      <Switch checked={refreshing} onCheckedChange={setRefreshing}>다시 불러오는 중</Switch>
      <DataGrid
        aria-label="API 키"
        rows={rows}
        getRowId={r => r.id}
        columns={columns}
        selection={selected}
        onSelectionChange={setSelected}
        onRowOrderChange={ids => setRows(rs => ids.map(id => rs.find(r => r.id === id)!))}
        pagination={{ defaultPageSize: 10 }}
        refreshing={refreshing}
      />
      <Pagination page={page} pageCount={20} onPageChange={setPage} showFirstLast={false} />
    </div>
  );
}
