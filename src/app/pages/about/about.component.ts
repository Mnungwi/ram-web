import { Component, OnInit, signal, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SeoService } from '../../core/services/seo.service';
import { PublicApiService } from '../../core/services/public-api.service';
import { TranslationService } from '../../core/services/translation.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="about-page fade-in-page">
      <!-- Banner -->
      <section class="page-banner text-center text-white py-5" [style.background-image]="'linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.75)), url(' + bannerImage() + ')'" style="background-size:cover; background-position:center; padding: 120px 0 !important;">
        <div class="container">
          <h1 class="display-4 fw-bold" style="font-family: var(--font-family-title)">{{ ts.get('about.banner_title') }}</h1>
          <p class="lead text-white-50">{{ ts.get('about.banner_sub') }}</p>
        </div>
      </section>

      <!-- Who We Are -->
      <section class="who-we-are py-5 bg-dark">
        <div class="container py-4 text-center" style="max-width: 800px;">
          <span class="subtitle text-primary fw-bold text-uppercase d-block mb-2" style="letter-spacing: 2px;">{{ ts.get('about.who_title') }}</span>
          <h2 class="fw-bold mb-4 text-white">{{ ts.pick(companyName(), companyNameSw()) }}</h2>
          <p class="text-white-50 fs-5 leading-relaxed">
            {{ ts.pick(whoWeAre(), whoWeAreSw()) }}
          </p>
        </div>
      </section>

      <!-- Vision & Mission -->
      <section class="vision-mission-section py-5 bg-dark border-top" style="border-color: rgba(255,255,255,0.05) !important;">
        <div class="container py-4">
          <div class="row">
            <div class="col-md-6 mb-4">
              <div class="p-4 border rounded glass-panel h-100" style="border-color: var(--glass-border) !important;">
                <div class="d-flex align-items-center mb-3">
                  <i class="bi bi-eye text-primary fs-2 me-3"></i>
                  <h3 class="fw-bold mb-0 text-white">{{ ts.get('about.vision_title') }}</h3>
                </div>
                <p class="text-white-50 leading-relaxed">
                  {{ ts.pick(vision(), visionSw()) }}
                </p>
              </div>
            </div>
            <div class="col-md-6 mb-4">
              <div class="p-4 border rounded glass-panel h-100" style="border-color: var(--glass-border) !important;">
                <div class="d-flex align-items-center mb-3">
                  <i class="bi bi-lightning text-secondary fs-2 me-3"></i>
                  <h3 class="fw-bold mb-0 text-white">{{ ts.get('about.mission_title') }}</h3>
                </div>
                <p class="text-white-50 leading-relaxed">
                  {{ ts.pick(mission(), missionSw()) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Managing Director Message -->
      <section id="md-message" class="chairman-section py-5 bg-dark border-top" style="border-color: rgba(255,255,255,0.05) !important;">
        <div class="container py-4">
          <div class="row align-items-center">
            <div class="col-md-5 mb-4 mb-md-0 text-center">
              <img [src]="resolveImage(mdPhoto())" [alt]="mdName()" class="img-fluid rounded shadow-lg border" style="max-height: 480px; width:100%; object-fit: cover; border-color: rgba(255,255,255,0.1) !important;">
            </div>
            <div class="col-md-7 ps-md-5">
              <span class="text-primary fw-bold text-uppercase d-block mb-2">{{ ts.get('about.leadership_msg') }}</span>
              <h2 class="fw-bold mb-3 text-white">{{ ts.get('about.md_title') }}</h2>
              <p class="text-white-50 fs-5 fst-italic leading-relaxed">
                "{{ ts.pick(mdQuote(), mdQuoteSw()) }}"
              </p>
              <h5 class="fw-bold mb-0 mt-4 text-white text-uppercase">{{ mdName() }}</h5>
              <small class="text-white-50">{{ ts.get('about.md_role') }}</small>
              
              <div class="mt-4 pt-3 border-top" style="border-color: rgba(255,255,255,0.1) !important;">
                <p class="mb-1 text-white-50" *ngIf="mdPhone()"><strong>Phone:</strong> <a [href]="'tel:' + mdPhone()" class="text-decoration-none text-primary">{{ mdPhone() }}</a></p>
                <p class="mb-0 text-white-50" *ngIf="mdEmail()"><strong>Email:</strong> <a [href]="'mailto:' + mdEmail()" class="text-decoration-none text-primary">{{ mdEmail() }}</a></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Board of Directors -->
      <section class="board-section py-5 bg-dark border-top" style="border-color: rgba(255,255,255,0.05) !important;">
        <div class="container py-4">
          <div class="section-header">
            <span class="subtitle text-primary text-uppercase fw-bold" style="letter-spacing:1px;">{{ ts.get('about.board_sub') }}</span>
            <h2 class="title text-white">{{ ts.get('about.board_title') }}</h2>
          </div>
          
          <div class="row justify-content-center mt-4">
            <div *ngFor="let item of boardDirectors()" class="col-lg-4 col-md-6 mb-4">
              <div class="card border p-4 text-center h-100 shadow-sm glass-panel" [style.border-color]="item.role.toLowerCase().includes('managing') ? 'var(--secondary-color) !important' : 'var(--glass-border) !important'">
                <div class="mb-3">
                  <img [src]="resolveImage(item.photo)" [alt]="item.name" class="rounded-circle border p-1" style="width: 100px; height: 100px; object-fit: cover;" [style.border-color]="item.role.toLowerCase().includes('managing') ? 'var(--secondary-color) !important' : 'rgba(255,255,255,0.1) !important'">
                </div>
                <h4 class="fw-bold mb-1 text-uppercase" [class.text-primary]="item.role.toLowerCase().includes('managing')" [class.text-white]="!item.role.toLowerCase().includes('managing')" style="font-size:1.15rem;">{{ item.name }}</h4>
                <p class="text-white-50 small mb-3">{{ ts.pick(item.role, item.role_sw) }}</p>
                <div class="pt-3 border-top small text-white-50" style="border-color: rgba(255,255,255,0.08) !important;">
                  <p class="mb-1" *ngIf="item.phone"><i class="bi bi-telephone me-1 text-primary"></i><a [href]="'tel:' + item.phone" class="text-decoration-none text-white-50">{{ item.phone }}</a></p>
                  <p class="mb-0" *ngIf="item.email"><i class="bi bi-envelope me-1 text-primary"></i><a [href]="'mailto:' + item.email" class="text-decoration-none text-white-50">{{ item.email }}</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Key Management Team (Our People) -->
      <section class="management-section py-5 bg-dark border-top" style="border-color: rgba(255,255,255,0.05) !important;">
        <div class="container py-4">
          <div class="section-header">
            <span class="subtitle text-primary text-uppercase fw-bold" style="letter-spacing:1px;">{{ ts.get('about.mgmt_sub') }}</span>
            <h2 class="title text-white">{{ ts.get('about.mgmt_title') }}</h2>
          </div>
          
          <div class="row justify-content-center mt-4">
            <div *ngFor="let item of managementTeam()" class="col-lg-4 col-md-6 mb-4">
              <div class="card border p-4 text-center h-100 shadow-sm glass-panel" style="border-color: var(--glass-border) !important;">
                <div class="mb-3">
                  <img [src]="resolveImage(item.photo)" [alt]="item.name" class="rounded-circle border p-1" style="width: 80px; height: 80px; object-fit: cover; border-color: rgba(255,255,255,0.1) !important;">
                </div>
                <h4 class="fw-bold mb-1 text-white text-uppercase" style="font-size:1.15rem;">{{ item.name }}</h4>
                <p class="text-white-50 small mb-3">{{ ts.pick(item.role, item.role_sw) }}</p>
                <div class="pt-3 border-top small text-white-50" style="border-color: rgba(255,255,255,0.08) !important;">
                  <p class="mb-1" *ngIf="item.phone"><i class="bi bi-telephone me-1 text-primary"></i><a [href]="'tel:' + item.phone" class="text-decoration-none text-white-50">{{ item.phone }}</a></p>
                  <p class="mb-0" *ngIf="item.email"><i class="bi bi-envelope me-1 text-primary"></i><a [href]="'mailto:' + item.email" class="text-decoration-none text-white-50">{{ item.email }}</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `
})
export class AboutComponent implements OnInit {
  companyName = signal('United Ram Construction Company Ltd');
  companyNameSw = signal('');
  whoWeAre = signal('United Ram Construction was established and incorporated under the Zanzibar Companies Decree, Cap 153. United Ram Construction is a well-established firm proud of its qualified staff, carrying extensive, multi-year experience in design, estimation, and heavy civil construction works.');
  whoWeAreSw = signal('');
  vision = signal('To be one among the best building construction companies in Zanzibar, serving both government and private customers by providing exceptional buildings, reliable networks, and better services.');
  visionSw = signal('');
  mission = signal('To execute engineering and construction services safely, efficiently, and to the highest standards of quality while maintaining environmental care and customer satisfaction.');
  missionSw = signal('');
  bannerImage = signal('/project3.jpg');

  // Dynamic MD message inputs
  mdName = signal('MOHAMMED MUHIDDIN CHACHE');
  mdQuote = signal('Our journey has been defined by our commitment to engineering excellence. We continue to adapt to sustainable development goals, ensuring that every bridge, road, and building we erect is built for generations to come.');
  mdQuoteSw = signal('');
  mdPhoto = signal('/managing-director.jpg');
  mdPhone = signal('+255 777 412 337');
  mdEmail = signal('managing_director@unitedram.com');

  // Dynamic lists
  boardDirectors = signal<any[]>([
    { name: 'ALI MUHIDDIN CHACHE', role: 'Director', phone: '+255 777 412 337', email: 'managing_director@unitedram.com', photo: '/cropped-logo.png' },
    { name: 'MOHAMMED M. CHACHE', role: 'Managing Director', phone: '+255 777 412 337', email: 'managing_director@unitedram.com', photo: '/managing-director.jpg' },
    { name: 'MAKAME MUHIDDIN CHACHE', role: 'Director', phone: '+255 777 471 849', email: 'info@unitedram.com', photo: '/cropped-logo.png' }
  ]);

  managementTeam = signal<any[]>([
    { name: 'FALHIYA MOHAMMED MUHIDDIN', role: 'Procurement Manager', phone: '+255 777 250 625', email: 'procurement@unitedram.com', photo: '/cropped-logo.png' },
    { name: 'MUHIDINI MASOUD MALIK', role: 'Project Manager', phone: '+255 777 988 498', email: 'project_manager@unitedram.com', photo: '/cropped-logo.png' },
    { name: 'HAMIS MATINA LUTOBEKA', role: 'Quantity Surveyor', phone: '+255 622 261 824', email: 'qs@unitedram.com', photo: '/cropped-logo.png' }
  ]);

  constructor(
    private seo: SeoService,
    private apiSvc: PublicApiService,
    public ts: TranslationService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.seo.generateTags('about');
    if (isPlatformBrowser(this.platformId)) {
      this.apiSvc.getSettings().subscribe(res => {
        if (res.success && res.data) {
          const d = res.data;
          if (d.about_company_name) this.companyName.set(d.about_company_name);
          if (d.about_company_name_sw) this.companyNameSw.set(d.about_company_name_sw);
          if (d.about_who_we_are) this.whoWeAre.set(d.about_who_we_are);
          if (d.about_who_we_are_sw) this.whoWeAreSw.set(d.about_who_we_are_sw);
          if (d.about_vision) this.vision.set(d.about_vision);
          if (d.about_vision_sw) this.visionSw.set(d.about_vision_sw);
          if (d.about_mission) this.mission.set(d.about_mission);
          if (d.about_mission_sw) this.missionSw.set(d.about_mission_sw);
          if (d.banner_about) this.bannerImage.set(d.banner_about);

          // MD details
          if (d.about_md_name) this.mdName.set(d.about_md_name);
          if (d.about_md_quote) this.mdQuote.set(d.about_md_quote);
          if (d.about_md_quote_sw) this.mdQuoteSw.set(d.about_md_quote_sw);
          if (d.about_md_photo) this.mdPhoto.set(d.about_md_photo);
          if (d.about_md_phone) this.mdPhone.set(d.about_md_phone);
          if (d.about_md_email) this.mdEmail.set(d.about_md_email);

          // Board & Management
          if (d.about_board_directors_json) {
            try {
              this.boardDirectors.set(JSON.parse(d.about_board_directors_json));
            } catch {}
          }
          if (d.about_management_team_json) {
            try {
              this.managementTeam.set(JSON.parse(d.about_management_team_json));
            } catch {}
          }
        }
      });
    }
  }

  resolveImage(imagePath: string): string {
    if (!imagePath) return '/cropped-logo.png';
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
