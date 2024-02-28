export interface AccessResponse {
    access_token : string,
    token_type : string,
    expires_in : number,
    refresh_token : string,
    scope : string
}

export interface CurrentTrackObject {
    'name' : string,
    'progress_ms' : number,
    'duration' : number,
    'is_playing' : boolean,
    'type' : "track" | "episode" | "ad" | "unknown",
    'album_name' : string,
    'album_img' :  string,
    'artists' : string[]
  }