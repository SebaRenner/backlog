import { Component, input } from '@angular/core';

@Component({
  selector: 'app-language-display',
  imports: [],
  templateUrl: './language-display.html',
  styleUrl: './language-display.css',
})
export class LanguageDisplay {
  language = input.required<string>();

  textToColor(text: string): string {
    let r = 0, g = 0, b = 0;

    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      r = (r + charCode * 1) % 256;
      g = (g + charCode * 2) % 256;
      b = (b + charCode * 3) % 256;
    }

    return `rgb(${r}, ${g}, ${b})`;
  }
}
