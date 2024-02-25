import { Component, OnInit } from '@angular/core';
import { SpotifyDataService } from '../../services/spotify-data/spotify-data.service';
import { Router } from '@angular/router';
import { AccessResponse } from '../../utils/interfaces';

@Component({
  selector: 'app-callback',
  standalone: true,
  imports: [],
  templateUrl: './callback.component.html',
  styleUrl: './callback.component.scss'
})
export class CallbackComponent implements OnInit{
  constructor(private spotifyDataService: SpotifyDataService, private _router: Router) { }

  ngOnInit () {
    const previousState = localStorage.getItem('auth-state')
    const previousCodeVerifier = localStorage.getItem('code-verifier')

    const returnedData = new URLSearchParams(window.location.search)
    const returnedState = returnedData.get('state')
    const returnedCode = returnedData.get('code')

    if (
      returnedState &&
      returnedCode &&
      previousState &&
      previousCodeVerifier
    ) {
      if (returnedState != previousState) {
        //If state mismatch, stop the auth flow
        this._router.navigate(['']);
      } else {
        this.spotifyDataService
          .getData(returnedCode, previousCodeVerifier)
          .subscribe({
            next: result => {
              this.spotifyDataService.setAccessToken(result as AccessResponse)
              //localStorage.setItem('auth_object', JSON.stringify(result))
            },
            complete: () => {
              this._router.navigate(['']);
            }
          })
      }
    }
    else{
      //If fail then this page was reached on accident so redirect to home
      this._router.navigate(['']);
    }
  }

}
