export interface IArtist {
  name: string;
}

export interface ITrack {
  name: string;
  artist?: string;
  artists: IArtist[];
  uri: string;
  id: string;
  duration_ms: number;
  likes: number;
}

export interface IPlayer {
  status: string;
  is_playing: boolean;
  item: ITrack;
  progress_ms: number;
  shuffle_state: boolean;
  timestamp: number;
}
