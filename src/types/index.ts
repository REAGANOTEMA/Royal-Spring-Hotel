"use client";

export interface Booking {
  id: string;
  guest: string;
  email?: string; // Added to fix TS errors
  room: string;
  status: string;
  amount: string;
  check_in?: string;
  check_out?: string;
  created_at?: string;
}

export interface Room {
  id: string;
  type: string;
  price: number;
  status: string;
  floor: string;
  image: string;
}

export interface Incident {
  id: string;
  type: string;
  description: string;
  reported_by: string;
  date: string;
  priority: string;
  status: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  status: string;
  salary: string;
  net: string;
}

export interface BillingRecord {
  id: string;
  guest: string;
  room: string;
  amount: string;
  status: string;
  date: string;
}