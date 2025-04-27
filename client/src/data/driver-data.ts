// filepath: /home/eshan/Eatzilla-food-ordering-and-delivery-system/client/src/data/driver-data.ts
import { Location } from '@/types/delivery';

// Driver status enum
export enum DriverStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  ON_DELIVERY = 'on_delivery',
  ON_BREAK = 'on_break',
}

// Vehicle types enum
export enum VehicleType {
  MOTORCYCLE = 'motorcycle',
  CAR = 'car',
  BICYCLE = 'bicycle',
  SCOOTER = 'scooter',
  VAN = 'van',
}

// Driver vehicle information
export interface DriverVehicle {
  type: VehicleType | string;
  model?: string;
  year?: number;
  color: string;
  licensePlate?: string;
  registrationNumber?: string;
  insuranceNumber?: string;
  lastServiceDate?: Date;
}

// Driver license information
export interface DriverLicense {
  number: string;
  expiryDate: Date;
  category: string;
  state: string;
  issueDate: Date;
}

// Driver banking/payment information
export interface DriverPaymentInfo {
  accountNumber?: string;
  bankName?: string;
  branchCode?: string;
  taxId?: string;
  preferredPaymentMethod: 'bank_transfer' | 'digital_wallet' | 'cash';
}

// Driver performance metrics
export interface DriverPerformance {
  totalDeliveries: number;
  completedDeliveries: number;
  cancelledDeliveries: number;
  averageRating: number;
  onTimeDeliveryRate: number;
  averageDeliveryTime: number; // in minutes
  totalEarnings: number;
  customerComplaints: number;
  incentivesEarned: number;
  lastReviewDate?: Date;
}

// Comprehensive driver profile
export interface DriverProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  currentLocation: Location;
  status: DriverStatus | string;
  activeDeliveryId?: string;
  verified: boolean;
  onboardingDate: Date;
  license: DriverLicense;
  vehicle: DriverVehicle;
  profileImageUrl?: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  paymentInfo: DriverPaymentInfo;
  performance: DriverPerformance;
  preferredZones?: string[];
  languages: string[];
  documents: {
    idProofUrl?: string;
    addressProofUrl?: string;
    insuranceDocUrl?: string;
    licenseDocUrl?: string;
    vehicleRegDocUrl?: string;
  };
  notes?: string;
}

// Expanded dataset of delivery drivers with comprehensive details
export const driverProfiles: DriverProfile[] = [
  {
    id: 'driver-001',
    name: 'Alex Rodriguez',
    email: 'alex.r@example.com',
    phone: '077-111-2222',
    dateOfBirth: new Date('1990-05-15'),
    address: '42 Temple Lane',
    city: 'Colombo',
    state: 'Western Province',
    postalCode: '00300',
    currentLocation: {
      lat: 6.9073,
      lng: 79.8614,
    },
    status: DriverStatus.ON_DELIVERY,
    activeDeliveryId: 'del-002',
    verified: true,
    onboardingDate: new Date('2023-08-15'),
    license: {
      number: 'DL98765432',
      expiryDate: new Date('2027-05-15'),
      category: 'A',
      state: 'Western Province',
      issueDate: new Date('2017-05-15'),
    },
    vehicle: {
      type: VehicleType.MOTORCYCLE,
      model: 'Honda CB150R',
      year: 2022,
      color: 'blue',
      licensePlate: 'WP-BCD-1234',
      registrationNumber: 'REG42687',
      insuranceNumber: 'INS7845621',
      lastServiceDate: new Date('2025-02-10'),
    },
    profileImageUrl: '/images/drivers/alex_rodriguez.jpg',
    emergencyContact: {
      name: 'Maria Rodriguez',
      phone: '077-222-3333',
      relationship: 'Spouse',
    },
    paymentInfo: {
      accountNumber: '789456123456',
      bankName: 'National Savings Bank',
      branchCode: 'COL-001',
      taxId: 'TAX7485126',
      preferredPaymentMethod: 'bank_transfer',
    },
    performance: {
      totalDeliveries: 842,
      completedDeliveries: 837,
      cancelledDeliveries: 5,
      averageRating: 4.8,
      onTimeDeliveryRate: 96,
      averageDeliveryTime: 22,
      totalEarnings: 11568.75,
      customerComplaints: 3,
      incentivesEarned: 750.5,
      lastReviewDate: new Date('2025-03-15'),
    },
    preferredZones: ['Colombo 03', 'Colombo 04', 'Colombo 07'],
    languages: ['English', 'Sinhala', 'Tamil'],
    documents: {
      idProofUrl: '/documents/drivers/alex_id.pdf',
      addressProofUrl: '/documents/drivers/alex_address.pdf',
      insuranceDocUrl: '/documents/drivers/alex_insurance.pdf',
      licenseDocUrl: '/documents/drivers/alex_license.pdf',
      vehicleRegDocUrl: '/documents/drivers/alex_vehicle_reg.pdf',
    },
  },
  {
    id: 'driver-002',
    name: 'Maria Garcia',
    email: 'maria.g@example.com',
    phone: '071-333-4444',
    dateOfBirth: new Date('1988-11-23'),
    address: '78 Park Street',
    city: 'Colombo',
    state: 'Western Province',
    postalCode: '00500',
    currentLocation: {
      lat: 6.9107,
      lng: 79.8559,
    },
    status: DriverStatus.OFFLINE,
    verified: true,
    onboardingDate: new Date('2023-06-10'),
    license: {
      number: 'DL45678912',
      expiryDate: new Date('2028-11-23'),
      category: 'B',
      state: 'Western Province',
      issueDate: new Date('2018-11-23'),
    },
    vehicle: {
      type: VehicleType.CAR,
      model: 'Toyota Prius',
      year: 2021,
      color: 'silver',
      licensePlate: 'WP-CAB-5678',
      registrationNumber: 'REG98745',
      insuranceNumber: 'INS5423987',
      lastServiceDate: new Date('2025-01-05'),
    },
    profileImageUrl: '/images/drivers/maria_garcia.jpg',
    emergencyContact: {
      name: 'Carlos Garcia',
      phone: '071-444-5555',
      relationship: 'Brother',
    },
    paymentInfo: {
      accountNumber: '123789456123',
      bankName: 'Commercial Bank',
      branchCode: 'COM-052',
      taxId: 'TAX3698741',
      preferredPaymentMethod: 'digital_wallet',
    },
    performance: {
      totalDeliveries: 756,
      completedDeliveries: 752,
      cancelledDeliveries: 4,
      averageRating: 4.9,
      onTimeDeliveryRate: 98,
      averageDeliveryTime: 25,
      totalEarnings: 13245.5,
      customerComplaints: 1,
      incentivesEarned: 980.25,
      lastReviewDate: new Date('2025-03-20'),
    },
    preferredZones: ['Colombo 02', 'Colombo 03', 'Colombo 04'],
    languages: ['English', 'Spanish', 'Sinhala'],
    documents: {
      idProofUrl: '/documents/drivers/maria_id.pdf',
      addressProofUrl: '/documents/drivers/maria_address.pdf',
      insuranceDocUrl: '/documents/drivers/maria_insurance.pdf',
      licenseDocUrl: '/documents/drivers/maria_license.pdf',
      vehicleRegDocUrl: '/documents/drivers/maria_vehicle_reg.pdf',
    },
  },
  {
    id: 'driver-003',
    name: 'James Wilson',
    email: 'james.w@example.com',
    phone: '076-555-6666',
    dateOfBirth: new Date('1995-02-18'),
    address: '15 Beach Road',
    city: 'Colombo',
    state: 'Western Province',
    postalCode: '00700',
    currentLocation: {
      lat: 6.9216,
      lng: 79.8562,
    },
    status: DriverStatus.ONLINE,
    verified: true,
    onboardingDate: new Date('2024-01-25'),
    license: {
      number: 'DL65432198',
      expiryDate: new Date('2029-02-18'),
      category: 'A',
      state: 'Western Province',
      issueDate: new Date('2019-02-18'),
    },
    vehicle: {
      type: VehicleType.BICYCLE,
      model: 'Giant FastRoad',
      year: 2023,
      color: 'red',
      registrationNumber: 'N/A',
      lastServiceDate: new Date('2025-04-01'),
    },
    profileImageUrl: '/images/drivers/james_wilson.jpg',
    emergencyContact: {
      name: 'Emma Wilson',
      phone: '076-666-7777',
      relationship: 'Sister',
    },
    paymentInfo: {
      accountNumber: '456123789456',
      bankName: "People's Bank",
      branchCode: 'PB-023',
      taxId: 'TAX2589631',
      preferredPaymentMethod: 'digital_wallet',
    },
    performance: {
      totalDeliveries: 235,
      completedDeliveries: 232,
      cancelledDeliveries: 3,
      averageRating: 4.7,
      onTimeDeliveryRate: 95,
      averageDeliveryTime: 18,
      totalEarnings: 4350.25,
      customerComplaints: 2,
      incentivesEarned: 325.5,
      lastReviewDate: new Date('2025-03-25'),
    },
    preferredZones: ['Colombo 03', 'Colombo 07'],
    languages: ['English', 'Sinhala'],
    documents: {
      idProofUrl: '/documents/drivers/james_id.pdf',
      addressProofUrl: '/documents/drivers/james_address.pdf',
      licenseDocUrl: '/documents/drivers/james_license.pdf',
    },
  },
  {
    id: 'driver-004',
    name: 'Priyanka Sharma',
    email: 'priyanka.s@example.com',
    phone: '075-777-8888',
    dateOfBirth: new Date('1992-07-12'),
    address: '89 Lotus Road',
    city: 'Colombo',
    state: 'Western Province',
    postalCode: '00400',
    currentLocation: {
      lat: 6.9138,
      lng: 79.8473,
    },
    status: DriverStatus.ON_DELIVERY,
    activeDeliveryId: 'del-007',
    verified: true,
    onboardingDate: new Date('2023-09-05'),
    license: {
      number: 'DL32165498',
      expiryDate: new Date('2027-07-12'),
      category: 'A',
      state: 'Western Province',
      issueDate: new Date('2017-07-12'),
    },
    vehicle: {
      type: VehicleType.SCOOTER,
      model: 'Vespa Primavera',
      year: 2022,
      color: 'turquoise',
      licensePlate: 'WP-AJK-7890',
      registrationNumber: 'REG65432',
      insuranceNumber: 'INS9876543',
      lastServiceDate: new Date('2025-03-15'),
    },
    profileImageUrl: '/images/drivers/priyanka_sharma.jpg',
    emergencyContact: {
      name: 'Raj Sharma',
      phone: '075-888-9999',
      relationship: 'Spouse',
    },
    paymentInfo: {
      accountNumber: '321654987321',
      bankName: 'Sampath Bank',
      branchCode: 'SAM-014',
      taxId: 'TAX1472583',
      preferredPaymentMethod: 'bank_transfer',
    },
    performance: {
      totalDeliveries: 512,
      completedDeliveries: 508,
      cancelledDeliveries: 4,
      averageRating: 4.8,
      onTimeDeliveryRate: 97,
      averageDeliveryTime: 23,
      totalEarnings: 8760.75,
      customerComplaints: 2,
      incentivesEarned: 625.5,
      lastReviewDate: new Date('2025-04-02'),
    },
    preferredZones: ['Colombo 02', 'Colombo 04', 'Colombo 05'],
    languages: ['English', 'Hindi', 'Sinhala'],
    documents: {
      idProofUrl: '/documents/drivers/priyanka_id.pdf',
      addressProofUrl: '/documents/drivers/priyanka_address.pdf',
      insuranceDocUrl: '/documents/drivers/priyanka_insurance.pdf',
      licenseDocUrl: '/documents/drivers/priyanka_license.pdf',
      vehicleRegDocUrl: '/documents/drivers/priyanka_vehicle_reg.pdf',
    },
  },
  {
    id: 'driver-005',
    name: 'David Perera',
    email: 'david.p@example.com',
    phone: '078-999-0000',
    dateOfBirth: new Date('1987-10-05'),
    address: '23 Marine Drive',
    city: 'Colombo',
    state: 'Western Province',
    postalCode: '00300',
    currentLocation: {
      lat: 6.8983,
      lng: 79.8537,
    },
    status: DriverStatus.ONLINE,
    verified: true,
    onboardingDate: new Date('2023-05-12'),
    license: {
      number: 'DL78945612',
      expiryDate: new Date('2028-10-05'),
      category: 'B',
      state: 'Western Province',
      issueDate: new Date('2018-10-05'),
    },
    vehicle: {
      type: VehicleType.VAN,
      model: 'Toyota HiAce',
      year: 2020,
      color: 'white',
      licensePlate: 'WP-PQR-4567',
      registrationNumber: 'REG78942',
      insuranceNumber: 'INS3216549',
      lastServiceDate: new Date('2025-02-28'),
    },
    profileImageUrl: '/images/drivers/david_perera.jpg',
    emergencyContact: {
      name: 'Nilmini Perera',
      phone: '078-000-1111',
      relationship: 'Spouse',
    },
    paymentInfo: {
      accountNumber: '987654321098',
      bankName: 'HSBC',
      branchCode: 'HSBC-005',
      taxId: 'TAX9517538',
      preferredPaymentMethod: 'bank_transfer',
    },
    performance: {
      totalDeliveries: 935,
      completedDeliveries: 928,
      cancelledDeliveries: 7,
      averageRating: 4.6,
      onTimeDeliveryRate: 94,
      averageDeliveryTime: 28,
      totalEarnings: 15820.5,
      customerComplaints: 5,
      incentivesEarned: 1250.75,
      lastReviewDate: new Date('2025-03-10'),
    },
    preferredZones: ['Colombo 01', 'Colombo 02', 'Colombo 03', 'Colombo 06'],
    languages: ['English', 'Sinhala', 'Tamil'],
    documents: {
      idProofUrl: '/documents/drivers/david_id.pdf',
      addressProofUrl: '/documents/drivers/david_address.pdf',
      insuranceDocUrl: '/documents/drivers/david_insurance.pdf',
      licenseDocUrl: '/documents/drivers/david_license.pdf',
      vehicleRegDocUrl: '/documents/drivers/david_vehicle_reg.pdf',
    },
    notes: 'Specializes in large order deliveries and catering orders',
  },
  {
    id: 'driver-006',
    name: 'Amara Gunawardana',
    email: 'amara.g@example.com',
    phone: '070-222-3333',
    dateOfBirth: new Date('1993-01-30'),
    address: '56 Hill Street',
    city: 'Kandy',
    state: 'Central Province',
    postalCode: '20000',
    currentLocation: {
      lat: 7.2906,
      lng: 80.6337,
    },
    status: DriverStatus.ON_BREAK,
    verified: true,
    onboardingDate: new Date('2023-11-15'),
    license: {
      number: 'DL14253678',
      expiryDate: new Date('2027-01-30'),
      category: 'A',
      state: 'Central Province',
      issueDate: new Date('2017-01-30'),
    },
    vehicle: {
      type: VehicleType.MOTORCYCLE,
      model: 'Bajaj Pulsar',
      year: 2021,
      color: 'black',
      licensePlate: 'CP-XYZ-7890',
      registrationNumber: 'REG36912',
      insuranceNumber: 'INS7531598',
      lastServiceDate: new Date('2025-04-10'),
    },
    profileImageUrl: '/images/drivers/amara_gunawardana.jpg',
    emergencyContact: {
      name: 'Kumara Gunawardana',
      phone: '070-333-4444',
      relationship: 'Brother',
    },
    paymentInfo: {
      accountNumber: '654987321654',
      bankName: 'Bank of Ceylon',
      branchCode: 'BOC-032',
      taxId: 'TAX3698741',
      preferredPaymentMethod: 'cash',
    },
    performance: {
      totalDeliveries: 428,
      completedDeliveries: 425,
      cancelledDeliveries: 3,
      averageRating: 4.9,
      onTimeDeliveryRate: 99,
      averageDeliveryTime: 20,
      totalEarnings: 6950.25,
      customerComplaints: 0,
      incentivesEarned: 520.5,
      lastReviewDate: new Date('2025-04-05'),
    },
    preferredZones: ['Kandy Central', 'Peradeniya', 'Katugastota'],
    languages: ['English', 'Sinhala'],
    documents: {
      idProofUrl: '/documents/drivers/amara_id.pdf',
      addressProofUrl: '/documents/drivers/amara_address.pdf',
      insuranceDocUrl: '/documents/drivers/amara_insurance.pdf',
      licenseDocUrl: '/documents/drivers/amara_license.pdf',
      vehicleRegDocUrl: '/documents/drivers/amara_vehicle_reg.pdf',
    },
    notes: 'Excellent knowledge of hill country roads and shortcuts',
  },
  {
    id: 'driver-007',
    name: 'Mohammed Fazil',
    email: 'mohammed.f@example.com',
    phone: '077-444-5555',
    dateOfBirth: new Date('1989-09-12'),
    address: '78 Beach Road',
    city: 'Galle',
    state: 'Southern Province',
    postalCode: '80000',
    currentLocation: {
      lat: 6.0359,
      lng: 80.217,
    },
    status: DriverStatus.ONLINE,
    verified: true,
    onboardingDate: new Date('2023-07-22'),
    license: {
      number: 'DL95175383',
      expiryDate: new Date('2026-09-12'),
      category: 'B',
      state: 'Southern Province',
      issueDate: new Date('2016-09-12'),
    },
    vehicle: {
      type: VehicleType.CAR,
      model: 'Suzuki Swift',
      year: 2019,
      color: 'blue',
      licensePlate: 'SP-DEF-4321',
      registrationNumber: 'REG75319',
      insuranceNumber: 'INS1597536',
      lastServiceDate: new Date('2025-01-15'),
    },
    profileImageUrl: '/images/drivers/mohammed_fazil.jpg',
    emergencyContact: {
      name: 'Fatima Fazil',
      phone: '077-555-6666',
      relationship: 'Spouse',
    },
    paymentInfo: {
      accountNumber: '741852963753',
      bankName: 'Hatton National Bank',
      branchCode: 'HNB-021',
      taxId: 'TAX8529631',
      preferredPaymentMethod: 'bank_transfer',
    },
    performance: {
      totalDeliveries: 615,
      completedDeliveries: 610,
      cancelledDeliveries: 5,
      averageRating: 4.7,
      onTimeDeliveryRate: 96,
      averageDeliveryTime: 24,
      totalEarnings: 9875.5,
      customerComplaints: 3,
      incentivesEarned: 780.25,
      lastReviewDate: new Date('2025-03-20'),
    },
    preferredZones: ['Galle Fort', 'Unawatuna', 'Hikkaduwa'],
    languages: ['English', 'Sinhala', 'Tamil'],
    documents: {
      idProofUrl: '/documents/drivers/mohammed_id.pdf',
      addressProofUrl: '/documents/drivers/mohammed_address.pdf',
      insuranceDocUrl: '/documents/drivers/mohammed_insurance.pdf',
      licenseDocUrl: '/documents/drivers/mohammed_license.pdf',
      vehicleRegDocUrl: '/documents/drivers/mohammed_vehicle_reg.pdf',
    },
  },
  {
    id: 'driver-008',
    name: 'Dilini Rathnayake',
    email: 'dilini.r@example.com',
    phone: '071-666-7777',
    dateOfBirth: new Date('1994-04-08'),
    address: '45 Palm Grove',
    city: 'Negombo',
    state: 'Western Province',
    postalCode: '11500',
    currentLocation: {
      lat: 7.2095,
      lng: 79.8383,
    },
    status: DriverStatus.OFFLINE,
    verified: true,
    onboardingDate: new Date('2024-02-15'),
    license: {
      number: 'DL36985214',
      expiryDate: new Date('2029-04-08'),
      category: 'A',
      state: 'Western Province',
      issueDate: new Date('2019-04-08'),
    },
    vehicle: {
      type: VehicleType.SCOOTER,
      model: 'Honda Dio',
      year: 2023,
      color: 'purple',
      licensePlate: 'WP-HJK-6543',
      registrationNumber: 'REG95132',
      insuranceNumber: 'INS3579514',
      lastServiceDate: new Date('2025-03-28'),
    },
    profileImageUrl: '/images/drivers/dilini_rathnayake.jpg',
    emergencyContact: {
      name: 'Aruna Rathnayake',
      phone: '071-777-8888',
      relationship: 'Father',
    },
    paymentInfo: {
      accountNumber: '369852147963',
      bankName: 'Nations Trust Bank',
      branchCode: 'NTB-007',
      taxId: 'TAX7415963',
      preferredPaymentMethod: 'digital_wallet',
    },
    performance: {
      totalDeliveries: 185,
      completedDeliveries: 184,
      cancelledDeliveries: 1,
      averageRating: 4.9,
      onTimeDeliveryRate: 98,
      averageDeliveryTime: 19,
      totalEarnings: 3250.5,
      customerComplaints: 0,
      incentivesEarned: 250.75,
      lastReviewDate: new Date('2025-04-10'),
    },
    preferredZones: ['Negombo Beach', 'Katunayake', 'Seeduwa'],
    languages: ['English', 'Sinhala'],
    documents: {
      idProofUrl: '/documents/drivers/dilini_id.pdf',
      addressProofUrl: '/documents/drivers/dilini_address.pdf',
      insuranceDocUrl: '/documents/drivers/dilini_insurance.pdf',
      licenseDocUrl: '/documents/drivers/dilini_license.pdf',
      vehicleRegDocUrl: '/documents/drivers/dilini_vehicle_reg.pdf',
    },
    notes: 'New driver with excellent customer service skills',
  },
];

// Helper functions for driver operations

// Get a driver by ID
export const getDriverById = (id: string): DriverProfile | undefined => {
  return driverProfiles.find((driver) => driver.id === id);
};

// Get all drivers with a specific status
export const getDriversByStatus = (status: DriverStatus | string): DriverProfile[] => {
  return driverProfiles.filter((driver) => driver.status === status);
};

// Get all available drivers (online and not on delivery)
export const getAvailableDrivers = (): DriverProfile[] => {
  return driverProfiles.filter(
    (driver) => driver.status === DriverStatus.ONLINE || driver.status === DriverStatus.ON_BREAK,
  );
};

// Get all drivers currently on a delivery
export const getActiveDrivers = (): DriverProfile[] => {
  return driverProfiles.filter((driver) => driver.status === DriverStatus.ON_DELIVERY);
};

// Get drivers by vehicle type
export const getDriversByVehicleType = (vehicleType: VehicleType | string): DriverProfile[] => {
  return driverProfiles.filter((driver) => driver.vehicle.type === vehicleType);
};

// Get drivers sorted by rating (highest first)
export const getDriversSortedByRating = (): DriverProfile[] => {
  return [...driverProfiles].sort(
    (a, b) => b.performance.averageRating - a.performance.averageRating,
  );
};

// Get drivers by preferred zone
export const getDriversByPreferredZone = (zone: string): DriverProfile[] => {
  return driverProfiles.filter(
    (driver) => driver.preferredZones && driver.preferredZones.includes(zone),
  );
};

// Update driver status
export const updateDriverStatus = (
  driverId: string,
  newStatus: DriverStatus | string,
  activeDeliveryId?: string,
): DriverProfile | undefined => {
  const driverIndex = driverProfiles.findIndex((driver) => driver.id === driverId);

  if (driverIndex === -1) return undefined;

  // In a real application, this would be an API call that persists the change
  // For this mock, we're just updating the local array
  const updatedDriver = {
    ...driverProfiles[driverIndex],
    status: newStatus,
    activeDeliveryId: activeDeliveryId || driverProfiles[driverIndex].activeDeliveryId,
  };

  // Remove activeDeliveryId if the driver is no longer on delivery
  if (newStatus !== DriverStatus.ON_DELIVERY) {
    delete updatedDriver.activeDeliveryId;
  }

  return updatedDriver;
};

// Calculate driver efficiency score based on various metrics
export const calculateDriverEfficiencyScore = (driverId: string): number | undefined => {
  const driver = getDriverById(driverId);
  if (!driver) return undefined;

  const { performance } = driver;

  // Weighted calculation based on various performance metrics
  // This is a simplified example - real applications would have more sophisticated algorithms
  const completionRate = (performance.completedDeliveries / performance.totalDeliveries) * 100;
  const cancelRate = (performance.cancelledDeliveries / performance.totalDeliveries) * 100;

  const efficiencyScore =
    performance.averageRating * 20 * 0.3 +
    performance.onTimeDeliveryRate * 0.3 +
    completionRate * 0.2 +
    (100 - cancelRate) * 0.1 +
    (performance.averageDeliveryTime < 25 ? 100 : 80) * 0.1;

  return Math.round(efficiencyScore);
};
