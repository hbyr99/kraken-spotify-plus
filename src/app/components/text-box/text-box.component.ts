import { Component, Input } from '@angular/core';

@Component({
  selector: 'text-box',
  standalone: true,
  imports: [],
  templateUrl: './text-box.component.html',
  styleUrl: './text-box.component.scss'
})
export class TextBoxComponent {
  @Input() textContent: string = 'placeholder text placeholder text placeholder text ';
}
