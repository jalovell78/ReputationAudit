"use client";

import React, { createContext, useContext } from 'react';
import { TenantType, TenantConfig, tenantConfigs } from '@/lib/tenant';

interface TenantContextProps {
  tenant: TenantType;
  config: TenantConfig;
}

const TenantContext = createContext<TenantContextProps | undefined>(undefined);

export function TenantProvider({
  tenant,
  children,
}: {
  tenant: TenantType;
  children: React.ReactNode;
}) {
  const config = tenantConfigs[tenant];
  return (
    <TenantContext.Provider value={{ tenant, config }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}
