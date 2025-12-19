import React, { useMemo, useState } from 'react';
import { Search } from '../components/news/search';

export function NewsPage() {

  return (
    <main>
      <h1>Actualités</h1>
      <p>Liste des actualités et articles.</p>
      <Search />
     

    </main>
  );
}
