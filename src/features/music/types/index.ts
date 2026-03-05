export type TrackType = 'local' | 'youtube'

export interface Track {
  id: string
  title: string
  artist?: string
  url: string
  type: TrackType
  duration?: number // in seconds
  thumbnail?: string
}

export interface Theme {
  id: string
  name: string
  imageUrl: string
}
