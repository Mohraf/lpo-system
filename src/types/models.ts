export type SupplyItem = {
    id: number;
    name: string;
    quantity: number;
    unitPrice: number;
    unit: string; // Ensure unit is included
}

export type Lpo = {
    id: number;
    lpoNumber: string;
    prNumber: string;
    supplier: { id: number; name: string };
    subTotal: number;
    vatRate: number;
    total: number;
    createdAt: string;
    firstApproverId: number;
    secondApproverId: number;
    finalApproverId: number;
    rejected: string;
    site: { id: number; name: string };
    supplyItems: SupplyItem[];
}

export type Site = {
    id: number;
    name: string;
}

export type Supplier = {
    id: number;
    name: string;
}