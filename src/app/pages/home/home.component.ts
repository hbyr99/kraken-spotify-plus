import { Component, OnInit } from '@angular/core';
import { CircleProgressComponent } from '../../components/circle-progress/circle-progress.component';
import { SpotifyDataService } from '../../services/spotify-data/spotify-data.service';
import { TextBoxComponent } from '../../components/text-box/text-box.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CircleProgressComponent, TextBoxComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  authObject: string | null = null
  userAuthenticated: boolean = false

  progress_ms = 0;
  duration_ms = 1;
  constructor(private spotifyData : SpotifyDataService) {
  }
}
