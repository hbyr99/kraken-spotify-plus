import { Component, Input } from '@angular/core';

@Component({
  selector: 'circle-progress',
  standalone: true,
  imports: [],
  templateUrl: './circle-progress.component.html',
  styleUrl: './circle-progress.component.scss'
})
export class CircleProgressComponent {
  @Input() duration: number = 1;
  @Input() progress: number = 0;

  dasharray: number = 1946;
  dashoffset: number = 0;

  circleColor = "#e0e0e0"
  circleWidth = "16px"
  percentage = 0
  progressColor = "#1DB954"
  progressShape = "round"
  progressWidth = "16px"
  size = 640

  a_func() {
    const radius = (this.size / 2) - 10
    const circumference = 2 * 3.14 * radius
    this.percentage = Math.round(circumference * ((100 - this.progress) / 100))
    // https://github.com/nikitahl/svg-circle-progress-generator/blob/main/script.js
  }
}
