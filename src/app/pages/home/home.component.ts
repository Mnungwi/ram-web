import { Component, OnInit, OnDestroy, signal, Inject, PLATFORM_ID, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PublicApiService } from '../../core/services/public-api.service';
import { SeoService } from '../../core/services/seo.service';
import { TranslationService } from '../../core/services/translation.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('clientsContainer') clientsContainer!: ElementRef;
  autoScrollInterval: any;
  isPaused = false;

  scrollClients(direction: 'next' | 'prev') {
    if (!this.clientsContainer) return;
    const el = this.clientsContainer.nativeElement;
    const scrollAmount = 240; // width of card (180px) + gap (24px)
    if (direction === 'next') {
      el.scrollTo({ left: el.scrollLeft + scrollAmount, behavior: 'smooth' });
    } else {
      el.scrollTo({ left: el.scrollLeft - scrollAmount, behavior: 'smooth' });
    }
  }

  startAutoScroll() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.autoScrollInterval = setInterval(() => {
      if (this.isPaused || !this.clientsContainer) return;
      const el = this.clientsContainer.nativeElement;
      el.scrollLeft += 1;
      const maxScroll = el.scrollWidth / 2;
      if (el.scrollLeft >= maxScroll) {
        el.scrollLeft = 0;
      }
    }, 30);
  }

  // Stat counters matching original WordPress
  stats = [
    { label: 'Years Experience', value: 15, current: 0, suffix: '+' },
    { label: 'Completed Projects', value: 74, current: 0, suffix: '+' },
    { label: 'Active Equipment', value: 32, current: 0, suffix: '+' },
    { label: 'Registered Engineers', value: 18, current: 0, suffix: '' }
  ];

  // Hero Slider matching original WordPress images
  slides: any[] = [
    {
      title: 'Engineering Infrastructure Excellence',
      subtitle: 'Delivering world-class heavy civil, pipeline, and structural projects across Zanzibar & East Africa.',
      bg: '/project3.jpg',
      primaryBtn: 'Explore Services',
      secondaryBtn: 'Contact Us',
      primaryLink: '/services',
      secondaryLink: '/contact'
    },
    {
      title: 'Elite Concrete & Asphalt Works',
      subtitle: 'Highways, airports, and marine terminal paving designed to withstand regional maritime climates.',
      bg: '/tunguu1.jpg',
      primaryBtn: 'View Portfolio',
      secondaryBtn: 'Careers',
      primaryLink: '/projects',
      secondaryLink: '/careers'
    }
  ];
  activeSlide = signal(0);

  // Accordion Projects matching original WordPress Elementor widget
  accordionProjects: any[] = [
    { title: 'Malindi Car Parking', image: '/malindi2.jpg', subtitle: 'United Ram Engineering Excellency' },
    { title: 'Mbweni Road Rehab', image: '/mbweni-4.png', subtitle: 'United Ram Engineering Excellency' },
    { title: 'Tunguu Infrastructure', image: '/tunguu1.jpg', subtitle: 'United Ram Engineering Excellency' },
    { title: 'Kengeja Water Project', image: '/kengeja.jpg', subtitle: 'United Ram Engineering Excellency' }
  ];

  // Clients logo matching original WordPress clients list
  clients = [
    { name: 'ZSSF', image: '/zssf.png', link: 'https://zssf.or.tz/home' },
    { name: 'WEMA', image: '/wema.png', link: 'https://moez.go.tz/' },
    { name: 'KMKM', image: '/kmkm.png', link: 'https://www.kmkmzanzibar.go.tz/' },
    { name: 'Huatan Supply Chain', image: '/wachina.png', link: 'http://huatansupplychain.com/en/index.php?c=about&a=detail&id=5' }
  ];

  // CTA Section
  ctaTitle = signal("LET'S MAKE SOMETHING TOGETHER");
  ctaSubtitle = signal("Get in touch with us and send some basic info for a quick quote");
  ctaTitleSw = signal('');
  ctaSubtitleSw = signal('');

  // Marquee scroll control state
  marqueePaused = signal(false);

  services = signal<any[]>([]);
  featuredProjects = signal<any[]>([]);
  latestNews = signal<any[]>([]);

  showcaseSubtitle = signal('Focus Showcase');
  showcaseSubtitleSw = signal('');
  showcaseTitle = signal('Our Major Landmark Works');
  showcaseTitleSw = signal('');
  servicesSubtitle = signal('What We Do');
  servicesSubtitleSw = signal('');
  servicesTitle = signal('Our Engineering Expertise');
  servicesTitleSw = signal('');
  projectsSubtitle = signal('Our Works');
  projectsSubtitleSw = signal('');
  projectsTitle = signal('Featured Infrastructure');
  projectsTitleSw = signal('');

  // FAQ Accordion list
  faqs: any[] = [];

  constructor(
    private apiSvc: PublicApiService,
    private seo: SeoService,
    public ts: TranslationService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.seo.generateTags('home');
    if (isPlatformBrowser(this.platformId)) {
      this.loadContent();
      setTimeout(() => {
        this.startAutoScroll();
      }, 1000);
    }
  }

  ngOnDestroy(): void {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
    }
  }

  loadContent(): void {
    this.apiSvc.getServices().subscribe(res => {
      if (res.success) this.services.set(res.data);
    });

    this.apiSvc.getProjects({ limit: 6, showOnHomePage: 'true' }).subscribe(res => {
      if (res.success && res.data && res.data.length > 0) {
        this.featuredProjects.set(res.data);
      } else {
        // Fallback mock projects using actual wamp/public images
        this.featuredProjects.set([
          { id: 'p1', name: 'Malindi Car Parking Project', category: 'Infrastructure', image: '/malindi2.jpg', location: 'Malindi, Zanzibar', description: 'Construction of a modern multi-level parking facility with advanced traffic flow management in Malindi.' },
          { id: 'p2', name: 'Mbweni Rehabilitation Works', category: 'Roads & Civil', image: '/mbweni-4.png', location: 'Mbweni, Zanzibar', description: 'Rehabilitation of the main Mbweni transit roads, including drainage systems and high-grade asphalt paving.' },
          { id: 'p3', name: 'Tunguu Infrastructure Works', category: 'Water Network', image: '/tunguu1.jpg', location: 'Tunguu, Zanzibar', description: 'Installation of high-capacity drinking water supply lines, pipe fittings, and regional distribution networks.' },
          { id: 'p4', name: 'Kengeja Water Project', category: 'Civil Works', image: '/kengeja.jpg', location: 'Kengeja, Pemba', description: 'Civil engineering works for regional water storage tanks and pump stations in Kengeja, Pemba.' }
        ]);
      }
    });

    this.apiSvc.getNews().subscribe(res => {
      if (res.success) this.latestNews.set(res.data);
    });

    // Fetch dynamic configurations
    this.apiSvc.getSettings().subscribe(res => {
      if (res.success && res.data) {
        const d = res.data;
        if (d.stats_years_experience) this.stats[0].value = Number(d.stats_years_experience);
        if (d.stats_completed_projects) this.stats[1].value = Number(d.stats_completed_projects);
        if (d.stats_active_equipment) this.stats[2].value = Number(d.stats_active_equipment);
        if (d.stats_engineers) this.stats[3].value = Number(d.stats_engineers);

        if (d.home_cta_title) this.ctaTitle.set(d.home_cta_title);
        if (d.home_cta_subtitle) this.ctaSubtitle.set(d.home_cta_subtitle);
        if (d.home_cta_title_sw) this.ctaTitleSw.set(d.home_cta_title_sw);
        if (d.home_cta_subtitle_sw) this.ctaSubtitleSw.set(d.home_cta_subtitle_sw);

        if (d.home_showcase_subtitle) this.showcaseSubtitle.set(d.home_showcase_subtitle);
        if (d.home_showcase_subtitle_sw) this.showcaseSubtitleSw.set(d.home_showcase_subtitle_sw);
        if (d.home_showcase_title) this.showcaseTitle.set(d.home_showcase_title);
        if (d.home_showcase_title_sw) this.showcaseTitleSw.set(d.home_showcase_title_sw);
        if (d.home_services_subtitle) this.servicesSubtitle.set(d.home_services_subtitle);
        if (d.home_services_subtitle_sw) this.servicesSubtitleSw.set(d.home_services_subtitle_sw);
        if (d.home_services_title) this.servicesTitle.set(d.home_services_title);
        if (d.home_services_title_sw) this.servicesTitleSw.set(d.home_services_title_sw);
        if (d.home_projects_subtitle) this.projectsSubtitle.set(d.home_projects_subtitle);
        if (d.home_projects_subtitle_sw) this.projectsSubtitleSw.set(d.home_projects_subtitle_sw);
        if (d.home_projects_title) this.projectsTitle.set(d.home_projects_title);
        if (d.home_projects_title_sw) this.projectsTitleSw.set(d.home_projects_title_sw);

        if (d.home_accordion_json) {
          try {
            const arr = JSON.parse(d.home_accordion_json);
            if (Array.isArray(arr) && arr.length > 0) {
              this.accordionProjects = arr;
            }
          } catch (e) {
            console.error('Failed to parse home accordion JSON', e);
          }
        }

        if (d.home_partners_json) {
          try {
            const arr = JSON.parse(d.home_partners_json);
            if (Array.isArray(arr) && arr.length > 0) {
              this.clients = arr;
            }
          } catch (e) {
            console.error('Failed to parse partners JSON', e);
          }
        }

        if (d.hero_slider_json) {
          try {
            const parsed = JSON.parse(d.hero_slider_json);
            if (Array.isArray(parsed) && parsed.length > 0) {
              this.slides = parsed.map(s => ({
                title: s.title,
                title_sw: s.title_sw,
                subtitle: s.subtitle,
                subtitle_sw: s.subtitle_sw,
                bg: s.image || s.bg || '/project3.jpg',
                primaryBtn: 'Explore Services',
                secondaryBtn: 'Contact Us',
                primaryLink: '/services',
                secondaryLink: '/contact'
              }));
            }
          } catch (e) {
            console.error('Failed to parse slider JSON', e);
          }
        }
      }
      this.runCounters();
      this.startHeroTimer();
    });

    // Fetch FAQs
    this.apiSvc.getFaqs().subscribe(res => {
      if (res.success && res.data && res.data.length > 0) {
        this.faqs = res.data.map((faq: any) => ({
          q: faq.question,
          q_sw: faq.question_sw,
          a: faq.answer,
          a_sw: faq.answer_sw,
          open: signal(false)
        }));
      } else {
        // Fallback FAQs
        this.faqs = [
          { q: 'What project scopes does United Ram cover?', a: 'United Ram covers civil infrastructure, high-rise buildings, pipelines, water networks, and industrial factory construction.', open: signal(false) },
          { q: 'Is the company ISO certified?', a: 'Yes, we are fully certified for ISO 9001 (Quality Management), ISO 14001 (Environmental) and ISO 45001 (Occupational Safety).', open: signal(false) }
        ];
      }
    });
  }

  runCounters(): void {
    this.stats.forEach(s => {
      s.current = 0;
      const increment = Math.ceil(s.value / 40) || 1;
      const timer = setInterval(() => {
        if (s.current < s.value) {
          s.current += increment;
          if (s.current > s.value) s.current = s.value;
        } else {
          clearInterval(timer);
        }
      }, 30);
    });
  }

  sliderIntervalId: any = null;

  startHeroTimer(): void {
    this.stopHeroTimer();
    this.sliderIntervalId = setInterval(() => {
      this.nextSlide(true);
    }, 6000);
  }

  stopHeroTimer(): void {
    if (this.sliderIntervalId) {
      clearInterval(this.sliderIntervalId);
    }
  }

  nextSlide(isAuto = false): void {
    this.activeSlide.update(v => (v + 1) % this.slides.length);
    if (!isAuto) {
      this.startHeroTimer(); // Reset autoplay timer on manual click
    }
  }

  prevSlide(): void {
    this.activeSlide.update(v => (v - 1 + this.slides.length) % this.slides.length);
    this.startHeroTimer(); // Reset autoplay timer on manual click
  }

  goToSlide(index: number): void {
    this.activeSlide.set(index);
    this.startHeroTimer(); // Reset autoplay timer on manual click
  }

  toggleFaq(index: number): void {
    if (this.faqs[index]) {
      this.faqs[index].open.update((v: boolean) => !v);
    }
  }

  resolveImage(imagePath: string): string {
    if (!imagePath) return '/project3.jpg';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    if (imagePath.startsWith('/uploads') || imagePath.startsWith('uploads')) {
      const path = imagePath.startsWith('/') ? imagePath : '/' + imagePath;
      return environment.mediaUrl + path;
    }
    return imagePath;
  }
}
