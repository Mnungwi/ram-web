import { Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  currentLang = signal('EN');

  private dictionary: { [key: string]: { [key: string]: string } } = {
    EN: {
      'nav.home': 'Home',
      'nav.about': 'About Us',
      'nav.services': 'Services',
      'nav.projects': 'Projects',
      'nav.gallery': 'Gallery',
      'nav.news': 'News',
      'nav.careers': 'Careers',
      'nav.contact': 'Contact',
      'topbar.hours': 'Mon - Sat: 8am - 5pm',
      'topbar.staff_mail': 'Staff Mail',
      'topbar.portal': 'Staff Portal',
      'footer.useful_links': 'Useful Links',
      'footer.services': 'Our Services',
      'footer.contact': 'Contact Info',
      'footer.rights': 'All Rights Reserved',
      'home.slider_badge': 'United Ram Construction',
      'home.btn_services': 'Explore Services',
      'home.btn_contact': 'Contact Us',
      'home.btn_portfolio': 'View Portfolio',
      'home.btn_careers': 'Careers',
      'home.stats_experience': 'Years Experience',
      'home.stats_projects': 'Completed Projects',
      'home.stats_equipment': 'Active Equipment',
      'home.stats_engineers': 'Registered Engineers',
      'home.cta_btn': 'START A PROJECT',
      'home.faq_subtitle': 'Common Questions',
      'home.faq_title': 'Frequently Asked Questions',
      'home.clients_subtitle': 'Partnership',
      'home.clients_title': 'Our Happy Clients',
      'about.banner_title': 'About Our Company',
      'about.banner_sub': 'Building trust, delivering quality, and maintaining excellence in construction.',
      'about.who_title': 'Who We Are',
      'about.vision_title': 'Our Vision',
      'about.mission_title': 'Our Mission',
      'about.leadership_msg': 'Leadership Message',
      'about.md_title': 'Message from the Managing Director',
      'about.md_role': 'Managing Director of United Ram',
      'about.board_sub': 'Leadership',
      'about.board_title': 'Our Board Directors',
      'about.mgmt_sub': 'Our People',
      'about.mgmt_title': 'Key Management Team',
      'services.banner_title': 'Our Services',
      'services.banner_sub': 'Custom industrial, civil infrastructure, and commercial engineering solutions.',
      'services.btn_details': 'Read Details',
      'projects.banner_title': 'Projects Portfolio',
      'projects.banner_sub': 'Landmark structural and infrastructure engineering works across the region.',
      'projects.all': 'All Projects',
      'projects.view_details': 'View Details',
      'projects.location': 'Location',
      'gallery.banner_title': 'Photo Gallery',
      'gallery.banner_sub': 'Visual showcase of our engineering projects, machinery and team in action.',
      'gallery.all': 'All Photos',
      'news.banner_title': 'News & Articles',
      'news.banner_sub': 'Latest updates, project launches, and official company announcements.',
      'news.read_more': 'Read More',
      'careers.banner_title': 'Careers Portal',
      'careers.banner_sub': 'Join our professional engineering team and build the future of East Africa.',
      'careers.job_list': 'Job Openings',
      'careers.apply_now': 'Apply Now',
      'careers.no_jobs': 'Currently there are no open vacancies. Check back later!',
      'contact.banner_title': 'Contact Us',
      'contact.banner_sub': "Let's discuss your next engineering or infrastructure project.",
      'contact.heading': 'Send Us a Message',
      'contact.sub': 'Fill the form below and our team will get back to you within 24 hours.',
      'contact.name': 'Full Name',
      'contact.email': 'Email Address',
      'contact.phone': 'Phone Number',
      'contact.subject': 'Subject',
      'contact.message': 'Message',
      'contact.btn_send': 'Send Message',
      'contact.info_heading': 'Contact Information',
      'contact.office': 'Head Office',
      'contact.hours': 'Working Hours',
      'validation.required': 'This field is required.',
      'validation.email': 'Please enter a valid email address.',
      'validation.minlength': 'This field is too short.',
      'contact.sending': 'Sending your message...',
      'contact.success': 'Your message has been sent successfully!',
      'contact.error': 'Something went wrong. Please try again.',
      'projectDetail.badge': 'Project Showcase',
      'projectDetail.overview': 'Project Overview',
      'projectDetail.approach_title': 'Our Engineering Approach',
      'projectDetail.quality_safety': 'Quality & Safety:',
      'projectDetail.delivery': 'Delivery:',
      'projectDetail.approach_quality_default': 'Every project follows our standard engineering controls — certified materials, structural QA/QC checkpoints, and on-site HSE supervision throughout the build.',
      'projectDetail.approach_delivery_default': 'Our project management team coordinates procurement, site works, and stakeholder sign-off to keep delivery on schedule and within budget.',
      'projectDetail.gallery_title': 'Project Gallery & Library',
      'projectDetail.no_photos': 'No photos have been uploaded for this project yet.',
      'projectDetail.contract_metadata': 'Contract Metadata',
      'projectDetail.client': 'Client',
      'projectDetail.contract_valuation': 'Contract Valuation',
      'projectDetail.duration': 'Duration',
      'projectDetail.current_status': 'Current Status',
      'projectDetail.partner_title': 'Partner with Us',
      'projectDetail.partner_text': 'Leverage our certified engineering equipment and resources on your next project bid.',
      'projectDetail.consult_btn': 'Consult Our Engineers',
      'projectDetail.default_location': 'East Africa',
      'projectDetail.month_singular': 'Calendar Month',
      'projectDetail.month_plural': 'Calendar Months',
      'status.active': 'Active',
      'status.on_hold': 'On Hold',
      'status.completed': 'Completed',
      'status.cancelled': 'Cancelled'
    },
    SW: {
      'nav.home': 'Nyumbani',
      'nav.about': 'Kuhusu Sisi',
      'nav.services': 'Huduma',
      'nav.projects': 'Miradi',
      'nav.gallery': 'Picha zetu',
      'nav.news': 'Habari',
      'nav.careers': 'Nafasi za Kazi',
      'nav.contact': 'Wasiliana Nasi',
      'topbar.hours': 'Jtatu - Jumamosi: 2 Asubuhi - 11 Jioni',
      'topbar.staff_mail': 'Barua Pepe',
      'topbar.portal': 'Mfumo wa Wafanyakazi',
      'footer.useful_links': 'Viungo Muhimu',
      'footer.services': 'Huduma Zetu',
      'footer.contact': 'Maelezo ya Mawasiliano',
      'footer.rights': 'Haki Zote Zimehifadhiwa',
      'home.slider_badge': 'United Ram Construction',
      'home.btn_services': 'Angalia Huduma',
      'home.btn_contact': 'Wasiliana Nasi',
      'home.btn_portfolio': 'Tazama Miradi',
      'home.btn_careers': 'Nafasi za Kazi',
      'home.stats_experience': 'Miaka ya Uzoefu',
      'home.stats_projects': 'Miradi Iliyokamilika',
      'home.stats_equipment': 'Vifaa vya Ujenzi',
      'home.stats_engineers': 'Wahandisi Waliosajiliwa',
      'home.cta_btn': 'ANZA MRADI SASA',
      'home.faq_subtitle': 'Maswali ya Kawaida',
      'home.faq_title': 'Maswali Yanayoulizwa Mara kwa Mara',
      'home.clients_subtitle': 'Ushirikiano',
      'home.clients_title': 'Wateja Wetu Wanaofurahi',
      'about.banner_title': 'Kuhusu Kampuni Yetu',
      'about.banner_sub': 'Kujenga imani, kutoa ubora, na kudumisha ufanisi katika sekta ya ujenzi.',
      'about.who_title': 'Sisi ni Nani',
      'about.vision_title': 'Dira Yetu',
      'about.mission_title': 'Dhima Yetu',
      'about.leadership_msg': 'Ujumbe wa Uongozi',
      'about.md_title': 'Ujumbe kutoka kwa Mkurugenzi Mtendaji',
      'about.md_role': 'Mkurugenzi Mtendaji wa United Ram',
      'about.board_sub': 'Uongozi',
      'about.board_title': 'Bodi ya Wakurugenzi',
      'about.mgmt_sub': 'Watu Wetu',
      'about.mgmt_title': 'Timu ya Usimamizi',
      'services.banner_title': 'Huduma Zetu',
      'services.banner_sub': 'Ufumbuzi wa kihandisi wa viwanda, miundombinu ya kiraia, na biashara.',
      'services.btn_details': 'Soma Zaidi',
      'projects.banner_title': 'Miradi Yetu',
      'projects.banner_sub': 'Kazi kubwa za kihandisi za muundo na miundombinu katika kanda yetu.',
      'projects.all': 'Miradi Yote',
      'projects.view_details': 'Tazama Zaidi',
      'projects.location': 'Mahali',
      'gallery.banner_title': 'Picha Zetu',
      'gallery.banner_sub': 'Muonekano wa miradi yetu ya kihandisi, mashine na timu yetu kazini.',
      'gallery.all': 'Picha Zote',
      'news.banner_title': 'Habari & Makala',
      'news.banner_sub': 'Taarifa za hivi karibuni, uzinduzi wa miradi, na matangazo rasmi ya kampuni.',
      'news.read_more': 'Soma Zaidi',
      'careers.banner_title': 'Nafasi za Kazi',
      'careers.banner_sub': 'Jiunge na timu yetu ya wahandisi wataalamu na ujenge mustakabali wa Afrika Mashariki.',
      'careers.job_list': 'Nafasi Zilizopo',
      'careers.apply_now': 'Omba Sasa',
      'careers.no_jobs': 'Kwa sasa hakuna nafasi wazi za kazi. Tafadhali angalia baadae!',
      'contact.banner_title': 'Wasiliana Nasi',
      'contact.banner_sub': 'Tufanye mazungumzo kuhusu mradi wako ujao wa kihandisi au miundombinu.',
      'contact.heading': 'Ndiyo, Tuandikie Ujumbe',
      'contact.sub': 'Jaza fomu hapa chini na timu yetu itawasiliana nawe ndani ya saa 24.',
      'contact.name': 'Jina Kamili',
      'contact.email': 'Barua Pepe',
      'contact.phone': 'Namba ya Simu',
      'contact.subject': 'Mada',
      'contact.message': 'Ujumbe',
      'contact.btn_send': 'Tuma Ujumbe',
      'contact.info_heading': 'Maelezo ya Wasiliana Nasi',
      'contact.office': 'Ofisi Kuu',
      'contact.hours': 'Masaa ya Kazi',
      'validation.required': 'Sehemu hii inahitajika.',
      'validation.email': 'Tafadhali weka barua pepe sahihi.',
      'validation.minlength': 'Sehemu hii ni fupi mno.',
      'contact.sending': 'Tunatuma ujumbe wako...',
      'contact.success': 'Ujumbe wako umetumwa kwa mafanikio!',
      'contact.error': 'Hitilafu imetokea. Tafadhali jaribu tena.',
      'projectDetail.badge': 'Onyesho la Mradi',
      'projectDetail.overview': 'Muhtasari wa Mradi',
      'projectDetail.approach_title': 'Mbinu Yetu ya Kihandisi',
      'projectDetail.quality_safety': 'Ubora na Usalama:',
      'projectDetail.delivery': 'Utoaji:',
      'projectDetail.approach_quality_default': 'Kila mradi unafuata udhibiti wetu wa kawaida wa kihandisi — vifaa vilivyoidhinishwa, ukaguzi wa ubora wa muundo (QA/QC), na usimamizi wa afya na usalama (HSE) eneo la ujenzi wakati wote.',
      'projectDetail.approach_delivery_default': 'Timu yetu ya usimamizi wa mradi inaratibu ununuzi, kazi za eneo la mradi, na idhini ya wadau ili kuhakikisha utoaji unakamilika kwa wakati na ndani ya bajeti.',
      'projectDetail.gallery_title': 'Picha na Maktaba ya Mradi',
      'projectDetail.no_photos': 'Hakuna picha zilizopakiwa kwa mradi huu bado.',
      'projectDetail.contract_metadata': 'Taarifa za Mkataba',
      'projectDetail.client': 'Mteja',
      'projectDetail.contract_valuation': 'Thamani ya Mkataba',
      'projectDetail.duration': 'Muda',
      'projectDetail.current_status': 'Hali ya Sasa',
      'projectDetail.partner_title': 'Shirikiana Nasi',
      'projectDetail.partner_text': 'Tumia vifaa vyetu vya kihandisi vilivyoidhinishwa na rasilimali kwenye zabuni yako ijayo ya mradi.',
      'projectDetail.consult_btn': 'Wasiliana na Wahandisi Wetu',
      'projectDetail.default_location': 'Afrika Mashariki',
      'projectDetail.month_singular': 'Mwezi wa Kalenda',
      'projectDetail.month_plural': 'Miezi ya Kalenda',
      'status.active': 'Inaendelea',
      'status.on_hold': 'Imesimamishwa',
      'status.completed': 'Imekamilika',
      'status.cancelled': 'Imefutwa'
    }
  };

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem('user_lang');
      if (stored === 'SW' || stored === 'EN') {
        this.currentLang.set(stored);
      }
    }
  }

  setLanguage(lang: string) {
    if (lang === 'SW' || lang === 'EN') {
      this.currentLang.set(lang);
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('user_lang', lang);
      }
    }
  }

  get(key: string): string {
    const lang = this.currentLang(); // Registers reactive dependency
    const dict = this.dictionary[lang] || this.dictionary['EN'];
    return dict[key] || key;
  }

  /**
   * For database-driven content stored as EN/SW sibling fields (e.g.
   * service.title / service.title_sw). Returns the Swahili value when
   * Kiswahili is active AND a translation exists, otherwise falls back to
   * English so content is never blank.
   */
  pick(en: string | null | undefined, sw: string | null | undefined): string {
    if (this.currentLang() === 'SW' && sw && sw.trim()) return sw;
    return en || '';
  }

  /**
   * Translates a project/entity status enum value (e.g. "active",
   * "on_hold", "completed", "cancelled") into the current language's
   * display label, via the static "status.<value>" dictionary keys.
   * Falls back to the raw status string for anything not in the dictionary.
   */
  statusLabel(status: string | null | undefined): string {
    if (!status) return '';
    const key = `status.${status.toLowerCase().replace(/\s+/g, '_')}`;
    const label = this.get(key);
    return label === key ? status : label;
  }
}
