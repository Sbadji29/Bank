import * as React from 'react';
import DataTable from './liste';
import Search from './search';

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <div>
      <Search onSearch={setSearchQuery} />
      <DataTable filter={searchQuery} />
    </div>
  );
}
