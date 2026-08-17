export const getStatusColor = (status: string) => {
    switch (status) {
        case 'verified':
            return '#10B981';
        case 'pending':
            return '#F59E0B';
        case 'rejected':
            return '#EF4444';
        default:
            return '#94A3B8';
    }
};

export const getStatusText = (status: string) => {
    switch (status) {
        case 'verified':
            return 'Verified';
        case 'pending':
            return 'Under Review';
        case 'rejected':
            return 'Rejected';
        default:
            return 'Not Uploaded';
    }
};