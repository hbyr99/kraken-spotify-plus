import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import shajs from 'sha.js';
import { SpotifyDataService } from './services/spotify-data/spotify-data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Kraken Spotify Plus';
  
  constructor(private spotifyDataService: SpotifyDataService) {}


  onAuthClick () { this.spotifyDataService.redirectAuthFlow()}
}
