import { Component, Input } from '@angular/core';

@Component({
  selector: 'circle-progress',
  standalone: true,
  imports: [],
  templateUrl: './circle-progress.component.html',
  styleUrl: './circle-progress.component.scss'
})
export class CircleProgressComponent {
    dasharray: number = 1946;
    dashoffset!: number;

    @Input() progress = 0;
    @Input() duration = 1;

    constructor() {
        // this.dashoffset = this.dasharray - (this.progress / this.duration * this.dasharray);

        console.log(this.progress)
        console.log(this.duration)
        console.log(this.dashoffset)
        console.log(this.dasharray)
    }
}
