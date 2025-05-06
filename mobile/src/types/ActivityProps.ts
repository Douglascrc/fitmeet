export enum ParticipantStatus {
  NOT_SUBSCRIBED = "NOT_SUBSCRIBED",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  DENIED = "DENIED",
  CHECKED_IN = "CHECKED_IN",
  ACTIVITY_ENDED = "ACTIVITY_ENDED",
}

export type Participant = {
  id: string;
  name: string;
  avatar?: string;
  status: ParticipantStatus;
};

export type ActivityLocation = {
  latitude: number;
  longitude: number;
  address: string;
};

export type ActivityProps = {
  id: string;
  title: string;
  description: string;
  image: string;
  scheduledDate: string;
  location: ActivityLocation;
  participantCount: number;
  private: boolean;
  createdAt: string;
  creator: {
    id: string;
    name: string;
    avatar?: string;
  };
  isFinalized: boolean;
  confirmationCode?: string | null;
  userSubscriptionStatus?: ParticipantStatus;
};
