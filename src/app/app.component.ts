import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SpotifyDataService } from './services/spotify-data/spotify-data.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'Kraken Spotify Plus';
  kraken = false;

  constructor(private spotifyData: SpotifyDataService, private route: ActivatedRoute) {
  }

  ngOnInit() {
     this.route.queryParams.subscribe(param => {
      this.kraken = !!param['kraken'];
     });
     if (!this.spotifyData.isAuthenticated()) {
      this.spotifyData.redirectAuthFlow();
     }
  }
}
