'use client';
import React from 'react';
import { Provider } from 'react-redux';
import { store, persistor } from './store';
import { PersistGate } from 'redux-persist/es/integration/react';
import { Loader2 } from 'lucide-react';

const LoadingScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-background via-background to-background dark:from-gray-900 dark:via-black dark:to-gray-900 flex items-center justify-center">
    <div className="text-center space-y-4">
      <Loader2 className="w-12 h-12 text-purple-500 dark:text-purple-400 mx-auto animate-spin" />
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  return <Provider store={store}>
     <PersistGate loading={<LoadingScreen />} persistor={persistor}>
    {children}
    </PersistGate>
    </Provider>;
}