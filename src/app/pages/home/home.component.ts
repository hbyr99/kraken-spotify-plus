import { Component, OnInit } from '@angular/core';
import { CircleProgressComponent } from '../../circle-progress/circle-progress.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CircleProgressComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent{
    authObject: string | null = null
    userAuthenticated: boolean = false

    progress_ms = 100;
    duration_ms = 300;
    constructor() { }
}
