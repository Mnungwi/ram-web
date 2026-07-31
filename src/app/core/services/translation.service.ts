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
      'contact.hours': 'Working Hours'
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
      'contact.hours': 'Masaa ya Kazi'
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
}
