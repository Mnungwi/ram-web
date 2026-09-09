import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PublicApiService } from './core/services/public-api.service';

// Darkens/lightens a #rrggbb hex color by `pct` (-100..100) — used to rebuild
// the two-stop gradients from a single client-configured brand color.
function shade(hex: string, pct: number): string {
  const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex || '');
  if (!m) return hex;
  const adjust = (c: number) => {
    const n = pct < 0 ? c * (1 + pct / 100) : c + (255 - c) * (pct / 100);
    return Math.max(0, Math.min(255, Math.round(n)));
  };
  const r = adjust(parseInt(m[1], 16));
  const g = adjust(parseInt(m[2], 16));
  const b = adjust(parseInt(m[3], 16));
  return `#${[r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('')}`;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('website');

  constructor(private publicApi: PublicApiService) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      const preloader = document.getElementById('preloader');
      if (preloader) {
        preloader.classList.add('hide');
      }
      this.applyTheme();
    }
  }

  // White-label: pulls this client's own theme colors from their database
  // (website_settings) and applies them as CSS custom properties — the same
  // code, a completely different-looking site per client.
  private applyTheme(): void {
    this.publicApi.getSettings().subscribe({
      next: (res: any) => {
        const data = res?.data || res || {};
        const root = document.documentElement;
        const primary = data.theme_primary_color;
        const secondary = data.theme_secondary_color;
        const dark = data.theme_dark_color;
        const darkAccent = data.theme_dark_accent;

        if (primary) root.style.setProperty('--primary-color', primary);
        if (secondary) root.style.setProperty('--secondary-color', secondary);
        if (dark) root.style.setProperty('--dark-color', dark);
        if (darkAccent) root.style.setProperty('--dark-accent', darkAccent);

        if (secondary) {
          root.style.setProperty('--gold-gradient', `linear-gradient(135deg, ${shade(secondary, 20)} 0%, ${secondary} 100%)`);
        }
        if (primary) {
          root.style.setProperty('--sapphire-gradient', `linear-gradient(135deg, ${primary} 0%, ${shade(primary, -25)} 100%)`);
        }
        if (dark && darkAccent) {
          root.style.setProperty('--dark-gradient', `linear-gradient(180deg, ${dark} 0%, ${darkAccent} 100%)`);
        }
      },
      error: () => { /* keep the default RAM colors — never block rendering */ },
    });
  }
}
