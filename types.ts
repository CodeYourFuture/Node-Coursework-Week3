export type bookingType = {
  id: number;
  title: string;
  firstName: string;
  surname: string;
  email: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  [key: string]: string | number;
};
