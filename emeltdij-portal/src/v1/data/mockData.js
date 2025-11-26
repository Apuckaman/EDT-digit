// Mock adatok – később DB váltja

const companies = [
  {
    id: 1,
    name: 'Ween Bt.',
    taxNumber: '12345678-1-42',
    type: 'AFAMENTES',
    bankAccount: '12345678-00000000-00000001'
  },
  {
    id: 2,
    name: 'SwiftGate Bt.',
    taxNumber: '87654321-1-42',
    type: 'AFAS',
    bankAccount: '12345678-00000000-00000002'
  }
];

const clients = [
  {
    id: 1,
    code: 'UGYF001',
    name: 'Teszt Ügyfél 1',
    email: 'ugyfel1@example.com',
    phone: '+36-30-111-1111',
    billingAddress: '1111 Budapest, Teszt utca 1.',
    companyId: 1,
    status: 'active'
  },
  {
    id: 2,
    code: 'UGYF002',
    name: 'Teszt Ügyfél 2',
    email: 'ugyfel2@example.com',
    phone: '+36-30-222-2222',
    billingAddress: '2222 Budapest, Minta köz 2.',
    companyId: 2,
    status: 'active'
  }
];

const numbers = [
  {
    id: 1,
    number: '0690-111-1111',
    clientId: 1,
    companyId: 1,
    clientName: 'Teszt Ügyfél 1',
    companyName: 'Ween Bt.',
    status: 'active',
    plan: 'Alap díjcsomag',
    createdAt: '2025-11-25'
  },
  {
    id: 2,
    number: '0690-222-2222',
    clientId: 1,
    companyId: 1,
    clientName: 'Teszt Ügyfél 1',
    companyName: 'Ween Bt.',
    status: 'active',
    plan: 'Prémium díjcsomag',
    createdAt: '2025-11-25'
  },
  {
    id: 3,
    number: '0690-333-3333',
    clientId: 2,
    companyId: 2,
    clientName: 'Teszt Ügyfél 2',
    companyName: 'SwiftGate Bt.',
    status: 'inactive',
    plan: 'Alap díjcsomag',
    createdAt: '2025-11-25'
  }
];

const trafficRaw = [
  {
    id: 1,
    month: '2025-11',
    companyId: 1,
    sourceFile: 'provider_telenor_2025-11.xlsx',
    number: '0690-111-1111',
    calls: 120,
    minutes: 340,
    netRevenue: 45000,
    grossRevenue: 57150,
    other: 0,
    createdAt: '2025-11-26T10:00:00Z'
  },
  {
    id: 2,
    month: '2025-11',
    companyId: 1,
    sourceFile: 'provider_telekom_2025-11.xlsx',
    number: '0690-222-2222',
    calls: 80,
    minutes: 200,
    netRevenue: 30000,
    grossRevenue: 38100,
    other: 0,
    createdAt: '2025-11-26T10:05:00Z'
  },
  {
    id: 3,
    month: '2025-11',
    companyId: 2,
    sourceFile: 'provider_vodafone_2025-11.xlsx',
    number: '0690-333-3333',
    calls: 40,
    minutes: 120,
    netRevenue: 15000,
    grossRevenue: 19050,
    other: 0,
    createdAt: '2025-11-26T10:10:00Z'
  }
];

module.exports = {
  companies,
  clients,
  numbers,
  trafficRaw
};
