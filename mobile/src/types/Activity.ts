export type ActivityType = {
  id: string;
  name: string;
  description: string;
  image: string;
};

export type Activity = {
  id: string;
  title: string;
  description: string;
  type: string;
  image: string;
  confirmationCode: string | null;
  participantCount: number;
  address: {
    latitude: number;
    longitude: number;
  };
  scheduledDate: string;
  createdAt: string;
  completedAt: string | null;
  private: boolean;
  creator: {
    id: string;
    name: string;
    avatar: string;
  };
  userSubscriptionStatus: string;
};
