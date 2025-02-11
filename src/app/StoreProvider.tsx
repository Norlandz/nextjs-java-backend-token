'use client';

import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '../libRedux/store';

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore>(undefined);
  if (!storeRef.current) {
    // ensuring that this client component is re-render safe by checking the value of the reference to ensure that the store is only created once.
    // This component will only be rendered once per request on the server, but might be re-rendered multiple times on the client if there are stateful client components located above this component in the tree, or if this component also contains other mutable state that causes a re-render.
    // https://redux-toolkit.js.org/usage/nextjs
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
