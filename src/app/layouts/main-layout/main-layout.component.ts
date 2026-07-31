import { Component, HostListener, OnInit, signal, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PublicApiService } from '../../core/services/public-api.service';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
  isScrolled = signal(false);
  isSearchOpen = signal(false);
  searchQuery = signal('');
  isMobileMenuOpen = signal(false);
  currentLanguage: any;
  
  // Dynamic settings signals
  siteTitle = signal('United Ram Construction Company Limited');
  siteLogo = signal('/logo.png');
  contactEmail = signal('info@unitedram.com');
  contactPhone = signal('+255 777 471 849');
  contactAddress = signal('Mbweni, Zanzibar, Tanzania');
  socialFacebook = signal('#');
  socialTwitter = signal('#');
  socialInstagram = signal('#');
  socialLinkedin = signal('#');
  footerCopyright = signal('© 2026 United Ram Construction Company Ltd. All rights reserved.');

  // Dynamic mega menu values
  showCompanyMega = signal(false);
  showProjectsMega = signal(false);

  constructor(
    private apiSvc: PublicApiService,
    public ts: TranslationService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.currentLanguage = this.ts.currentLang;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.isScrolled.set(window.scrollY > 50);
    }
  }

  ngOnInit() {
    this.onWindowScroll();
    if (isPlatformBrowser(this.platformId)) {
      this.loadSettings();
    }
  }

  loadSettings(): void {
    this.apiSvc.getSettings().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const d = res.data;
          if (d.site_title) this.siteTitle.set(d.site_title);
          if (d.site_logo) this.siteLogo.set(d.site_logo);
          if (d.contact_email) this.contactEmail.set(d.contact_email);
          if (d.contact_phone) this.contactPhone.set(d.contact_phone);
          if (d.contact_address) this.contactAddress.set(d.contact_address);
          if (d.social_facebook) this.socialFacebook.set(d.social_facebook);
          if (d.social_twitter) this.socialTwitter.set(d.social_twitter);
          if (d.social_instagram) this.socialInstagram.set(d.social_instagram);
          if (d.social_linkedin) this.socialLinkedin.set(d.social_linkedin);
          if (d.footer_copyright) this.footerCopyright.set(d.footer_copyright);

          // Update favicon dynamically in browser
          if (d.site_favicon && typeof document !== 'undefined') {
            const fav = document.getElementById('favicon') as HTMLLinkElement || document.querySelector("link[rel*='icon']") as HTMLLinkElement;
            if (fav) fav.href = d.site_favicon;
          }
        }
      }
    });
  }

  toggleSearch() {
    this.isSearchOpen.update(v => !v);
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }

  setLanguage(lang: string) {
    this.ts.setLanguage(lang);
  }

  scrollToTop() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  onSearchSubmit() {
    if (this.searchQuery().trim()) {
      console.log('Search query:', this.searchQuery());
      this.isSearchOpen.set(false);
    }
  }

  resolveImage(imagePath: string): string {
    if (!imagePath) return '/logo.png';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    if (imagePath.startsWith('/uploads') || imagePath.startsWith('uploads')) {
      const path = imagePath.startsWith('/') ? imagePath : '/' + imagePath;
      return 'http://localhost:3000' + path;
    }
    return imagePath;
  }

  getPhoneList(): string[] {
    const val = this.contactPhone();
    if (!val) return [];
    return val.split(',').map(s => s.trim()).filter(s => s.length > 0);
  }
}
