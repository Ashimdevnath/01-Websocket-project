export interface IChat {
  senderId: string;
  receiverId: string;
  text: string;
  isRead: boolean;
  type: string;
  mediaUrl: string;
  isDelivered: boolean;
}