'use client';

import useMyHook from './useMyHook';

export default function Home() {
  const { value } = useMyHook('hello');
  return <p>{value}</p>;
}
