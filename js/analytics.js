// Y-Solutions ERP - Analytics & System Computations
const AnalyticsEngine = {
    // Helper to turn numbers into clean financial string layouts
    formatEGP(amount) {
        return new Intl.NumberFormat('en-EG', {
            style: 'currency',
            currency: 'EGP',
            maximumFractionDigits: 0
        }).format(amount);
    }
};
