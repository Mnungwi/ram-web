import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private apiUrl = `${environment.apiUrl}/seo`;

  constructor(
    private titleSvc: Title,
    private metaSvc: Meta,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  generateTags(pageKey: string): void {
    const defaultSEO: { [key: string]: any } = {
      home: { title: 'United Ram Construction - Elite Civil Engineering', description: 'Premier civil engineering in Zanzibar.', keywords: 'construction, united ram' },
      about: { title: 'About Us | United Ram Construction', description: 'About United Ram Construction.', keywords: 'directors, board, united ram' },
      services: { title: 'Our Engineering Services | United Ram', description: 'Expert civil works and pipelines.', keywords: 'services, building, water supply' },
      projects: { title: 'Our Project Portfolio | United Ram', description: 'Explore our construction portfolio.', keywords: 'projects, malindi, kengeja' },
      gallery: { title: 'Media Gallery | United Ram Construction', description: 'Drone footage and site photos of our projects.', keywords: 'gallery, photos, drone' },
      news: { title: 'News & Announcements | United Ram Construction', description: 'Latest contract updates and company news.', keywords: 'news, tender, zanzibar' },
      careers: { title: 'Careers Portal | United Ram Construction', description: 'Build your career with our engineering team.', keywords: 'careers, jobs, civil engineering' },
      contact: { title: 'Contact Us | United Ram Construction', description: 'Contact our offices for a quote.', keywords: 'contact, email, phone' }
    };

    const applyFallback = () => {
      const fallback = defaultSEO[pageKey] || defaultSEO['home'];
      this.titleSvc.setTitle(fallback.title);
      this.metaSvc.updateTag({ name: 'description', content: fallback.description });
      this.metaSvc.updateTag({ name: 'keywords', content: fallback.keywords });
    };

    // IMPORTANT: only call the API in the browser. This site does live SSR
    // (outputMode: "server") — every page's ngOnInit also runs on the Node
    // server for each request, and Angular's SSR render waits for pending
    // HttpClient calls before it can respond. If that request is ever slow
    // or unreachable from the server process, it blocks the ENTIRE page
    // render (every visitor just sees an endless spinner) instead of
    // failing one request. Keep the DB-driven SEO browser-only and swap the
    // title in shortly after first paint; use the static map for the initial
    // server-rendered HTML.
    if (isPlatformBrowser(this.platformId)) {
      this.http.get<any>(`${this.apiUrl}?pageKey=${pageKey}`).subscribe({
        next: (res) => {
          if (res && res.success && res.data && res.data.title) {
            const seo = res.data;
            this.titleSvc.setTitle(seo.title);
            this.metaSvc.updateTag({ name: 'description', content: seo.description || '' });
            this.metaSvc.updateTag({ name: 'keywords', content: seo.keywords || '' });
            this.metaSvc.updateTag({ property: 'og:title', content: seo.title });
            this.metaSvc.updateTag({ property: 'og:description', content: seo.description || '' });
          } else {
            applyFallback();
          }
        },
        error: () => applyFallback(),
      });
    } else {
      applyFallback();
    }
  }
}
