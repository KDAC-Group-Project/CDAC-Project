export const selectBookings = (s) => s.bookings?.bookings || [];
export const selectCurrentUserBookings = (s) => s.bookings?.currentUserBookings || [];
export const selectTotalBookings = (s) => selectBookings(s).length;
export const selectUpcomingBookings = (s) =>
  selectCurrentUserBookings(s).filter(b => new Date(b.startDate || b.travelDate) > new Date() && b.status === 'confirmed');
export const selectTotalPaid = (s) =>
  selectCurrentUserBookings(s)
    .filter(b => b.paymentStatus === 'paid')
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);
export const selectTotalRevenue = (s) => s.bookings?.stats?.totalRevenue || 0;
export const selectConfirmedBookingsCount = (s) => s.bookings?.stats?.confirmedCount || 0;
export const selectBookingsLoading = (s) => s.bookings?.loading || false;
export const selectBookingsError = (s) => s.bookings?.error;
