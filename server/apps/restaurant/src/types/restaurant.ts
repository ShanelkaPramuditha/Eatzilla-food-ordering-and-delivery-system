export type Address = {
  street: string;
  city: string;
  state: string;
  cordinates: {
    lat: { type: Number };
    lng: { type: Number };
  };
};

export enum RestaurantStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  PENDING = 'pending',
}
