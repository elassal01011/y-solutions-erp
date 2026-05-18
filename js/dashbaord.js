// Executive Dashboard Setup Loader
window.onload = () => {
    checkAccessControl(["Manager", "HR"]);
    initDashboardAnalytics();
};
