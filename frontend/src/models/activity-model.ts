type Address = {
  latitude: number;
  longitude: number;
};

type Creator = {
  id: string;
  name: string;
  avatar: string;
};

type Activity = {
  id: string;
  title: string;
  description: string;
  type: string;
  image: string;
  confirmationCode: string;
  participantCount: number;
  address: Address;
  scheduledDate: string;
  createdAt: string;
  completedAt: string;
  private: boolean;
  creator: Creator;
  userSubscriptionStatus: string;
};

export default Activity;
