import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpotifyDataService {
  client_id = '5ea95dd4b2d5448992411461aad7436c'
  auth_url = 'https://accounts.spotify.com/api/token'
  redirect_uri = 'http://localhost:4200/callback'

  headers = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
  })

  constructor (private http: HttpClient) {}

  getData (code: string, codeVerifier: string): Observable<any> {
    const body = new HttpParams()
    .set('code', code)
    .set('redirect_uri', this.redirect_uri)
    .set('grant_type', 'authorization_code')
    .set('client_id', this.client_id)
    .set('code_verifier', codeVerifier)

    return this.http.post(this.auth_url, body, { headers: this.headers })
  }
}
