import { headers } from 'next/headers';
import { TenantType } from './tenant';

export async function getTenantFromHeaders(): Promise<TenantType> {
  const headersList = await headers();
  const tenant = headersList.get('x-tenant-source');
  if (tenant === 'perception_mirror') {
    return 'perception_mirror';
  }
  return 'repstanding';
}
