import Search from './search';
import DataTable from './liste';
import React from 'react';

function UsersContent() {
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <div>
      <Search onSearch={setSearchQuery} />
      <DataTable filter={searchQuery} />
    </div>
  );
}

export default UsersContent;
