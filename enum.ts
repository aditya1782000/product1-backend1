const enums = {
    role: ['superAdmin', 'subAdmin', 'customer', 'employee'],
    plan: ['basic', 'pro', 'enterprise'],
    permission: [
        'Orders',
        'Products',
        'Customers',
        'Invoices',
        'Contact Forms',
        'Notification',
        'e-Challan',
        'Attendance',
    ],
    permissionType: ['ALL', 'A', 'E', 'D', 'V', 'AD'],
    unitType: ['KG', 'LTR', 'MT', 'PC'],
    supportedUploadType: [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'application/pdf',
        'application/csv',
        'application/msword',
    ],
    orderStatus: ['inApproval', 'approved', 'rejected', 'delivered'],
    orderType: ['customer', 'admin'],
    notificationType: ['offer', 'payment', 'delivery', 'reject', 'approved'],
};

export default enums;
