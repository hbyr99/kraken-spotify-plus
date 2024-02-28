import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import shajs from 'sha.js';
import { AccessResponse, CurrentTrackObject } from '../../utils/interfaces';

function randomString(length: number) {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  var result = ''
  for (var i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)]
  return result
}

function isTrack(trackInfo: SpotifyApi.TrackObjectFull | SpotifyApi.EpisodeObjectFull): trackInfo is SpotifyApi.TrackObjectFull {
  return 'album' in trackInfo;
}

@Injectable({
  providedIn: 'root'
})
export class SpotifyDataService {
  private client_id = '5ea95dd4b2d5448992411461aad7436c'
  private auth_url = 'https://accounts.spotify.com/api/token'
  private redirect_uri = 'http://localhost:4200/callback'
  private access_token: string | null = null;
  private currently_playing: SpotifyApi.CurrentlyPlayingObject | null = null;

  constructor(private http: HttpClient) {
    this.access_token = localStorage.getItem('access_token');
    setInterval(
      () =>
        this.isAuthenticated()
          ? this.getCurrentlyPlaying()
            .subscribe({
              next: result => this.setCurrentlyPlaying(result as SpotifyApi.CurrentlyPlayingObject)
            })
          : console.log('No access token found.'),
      5000
    )
  }

  public redirectAuthFlow() {
    const generated_state: string = randomString(16)
    //Code Verifier: create random string. Hash it w/ SHA256 and convert to base 64. Make it URL safe; now it's base-64-url-encoded :)
    const codeVerifier: string = randomString(128)
    var codeVerifierHash = shajs('sha256')
      .update(codeVerifier)
      .digest()
      .toString('base64')
    const codeChallenge = codeVerifierHash
      .replace(/=+$/, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')

    localStorage.setItem('auth-state', generated_state)
    localStorage.setItem('code-verifier', codeVerifier)

    //Authorization Link
    const baseURL: string = 'https://accounts.spotify.com/en/authorize?'
    const paramObject = {
      response_type: 'code',
      //TODO: replace this w/ your client_id from the spotify developer page  
      client_id: this.client_id,
      scope: 'user-read-currently-playing',
      redirect_uri: 'http://localhost:4200/callback',
      state: generated_state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256'
    }

    const paramString = new HttpParams({ fromObject: paramObject }).toString()
    const authLink = baseURL + paramString
    window.location.href = authLink
  }

  public getData(code: string, codeVerifier: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const body = new HttpParams()
      .set('code', code)
      .set('redirect_uri', this.redirect_uri)
      .set('grant_type', 'authorization_code')
      .set('client_id', this.client_id)
      .set('code_verifier', codeVerifier)

    return this.http.post(this.auth_url, body, { headers: headers })
  }

  public setAccessToken(token_info: AccessResponse) {
    this.access_token = token_info.access_token;
    localStorage.setItem('access_token', token_info.access_token);
    localStorage.setItem('expires_in', token_info.expires_in.toString());
    localStorage.setItem('refresh_token', token_info.refresh_token);
    localStorage.setItem('creation_time', (Date.now() / 1000).toString());
  }

  private isTokenValid(): boolean {
    const time_elapsed = (Date.now() / 1000) - Number(localStorage.getItem('creation_time'))
    return time_elapsed < Number(localStorage.getItem('expires_in'));
  }


  private refreshToken() {
    if (!this.isTokenValid()) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      });
      const body = new HttpParams()
        .set('grant_type', 'refresh_token')
        .set('refresh_token', localStorage.getItem('refresh_token')!)
        .set('client_id', this.client_id);

      this.http.post(
        'https://accounts.spotify.com/api/token',
        body,
        { headers: headers })
        .subscribe({
          next: result => this.setAccessToken(result as AccessResponse)
        });
    }
  }

  public isAuthenticated(): boolean {
    return !!this.access_token;
  }

  private getCurrentlyPlaying(): Observable<any> {
    this.refreshToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.access_token}`
    })
    return this.http.get('https://api.spotify.com/v1/me/player/currently-playing',
      { headers: headers })
  }

  private setCurrentlyPlaying(current_info: SpotifyApi.CurrentlyPlayingObject) {
    this.currently_playing = current_info;
  }

  // Currently only supports tracks. TODO: Add episode support
  public getCurrentObject() : CurrentTrackObject | null {
    if (this.currently_playing !== null) {
      if (isTrack(this.currently_playing.item!))
        return {
          'name': this.currently_playing.item.name,
          'progress_ms': this.currently_playing.progress_ms,
          'duration': this.currently_playing.item.duration_ms,
          'is_playing': this.currently_playing.is_playing,
          'type': this.currently_playing.currently_playing_type,
          'album_name': this.currently_playing.item.album.name,
          'album_img': this.currently_playing.item.album.images[0].url,
          'artists': this.currently_playing.item.artists.map(artist => artist.name)
        } as CurrentTrackObject
    }
    return null
  }
}
