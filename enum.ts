const enums = {
    role: ['superAdmin', 'subAdmin', 'customer', 'employee'],
    plan: ['basic', 'pro', 'enterprise'],
    permission: [
        'orders',
        'products',
        'customers',
        'invocies',
        'notification',
        'attendance',
    ],
    permissionType: ['ALL', 'A', 'E', 'D', 'V', 'AD'],
    unitType: ['KG', 'LTR', 'MT', 'PC'],
    supportedUploadType: [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'application/pdf',
        'application/csv',
        'application/msword'
    ],
    orderStatus: ['inApproval', 'approve', 'rejected', 'delivered',],
};

export default enums;
