import { Component, input } from '@angular/core';

@Component({
  selector: 'app-language-display',
  imports: [],
  templateUrl: './language-display.html',
  styleUrl: './language-display.css',
})
export class LanguageDisplay {
  language = input.required<string>();
}
