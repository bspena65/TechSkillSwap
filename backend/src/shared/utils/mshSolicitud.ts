export enum FriendRequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
}

export const personalizedMessage = (status: string) => {
  switch (status) {
    case FriendRequestStatus.PENDING:
      return 'Solicitud de conexión pendiente';
    case FriendRequestStatus.ACCEPTED:
      return 'Solicitud de conexión aceptada';
    case FriendRequestStatus.REJECTED:
      return 'Solicitud de conexión rechazada';
    case FriendRequestStatus.COMPLETED:
      return 'Solicitud de conexión completada';
    default:
      return 'Estado desconocido';
  }
};
