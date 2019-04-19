export interface IArtist {
  name: string;
}

export interface IUser {
  _id: string;
  name: string;
  uid: string;
  spotifyId?: string;
  accessToken?: string;
  tokens: number;
  currentVibe: string;
}

export interface ITrack {
  name: string;
  artists: IArtist[];
  album: any;
  uri: string;
  duration_ms: number;
  id?: string;
  _id: string;
  isLiked?: boolean;
  likes?: number;
}

export interface IPlayer {
  status: string;
  is_playing: boolean;
  item: ITrack;
  progress_ms: number;
  shuffle_state: boolean;
  timestamp: number;
}

export interface IHost {
  name: string;
  _id: string;
}

export interface IVibe {
  explicit: boolean;
  name: string;
  genres: string[];
  _id: string;
}

export interface ILike {
  _id: string;
  hostId: string;
  queuerId: string;
  trackId: string;
}

interface Window {
  onSpotifyWebPlaybackSDKReady(): void;
}
