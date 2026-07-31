import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

export interface ProjectData {
  id: string;
  projectCode: string;
  name: string;
  description: string;
  image?: string;
  status: string;
  startDate: string;
  endDate: string;
  location?: string;
  totalBudget?: number;
  progress?: number;
  clientName?: string;
  showOnHomePage?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PublicApiService {
  private apiUrl = 'http://localhost:3000/api/public'; // Backend URL

  // Signals for state
  isLoading = signal(false);

  constructor(private http: HttpClient) {}

  getProjects(params?: any): Observable<any> {
    this.isLoading.set(true);
    return this.http.get<any>(`${this.apiUrl}/projects`, { params }).pipe(
      tap(() => this.isLoading.set(false)),
      catchError(err => {
        this.isLoading.set(false);
        console.error('Failed to load projects', err);
        return of({ success: false, data: [] });
      })
    );
  }

  getProjectById(id: string): Observable<any> {
    this.isLoading.set(true);
    return this.http.get<any>(`${this.apiUrl}/projects/${id}`).pipe(
      tap(() => this.isLoading.set(false)),
      catchError(err => {
        this.isLoading.set(false);
        console.error('Failed to load project details', err);
        return of({ success: false, data: null });
      })
    );
  }

  getServices(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/services`).pipe(
      catchError(() => of({
        success: true,
        data: [
          { id: '1', title: 'Building Construction', icon: 'bi-buildings', description: 'Commercial high-rise structures, residential towers, hotels, and luxury apartments.' },
          { id: '2', title: 'Infrastructure & Roads', icon: 'bi-road-spikes', description: 'Highways, complex interchanges, bridges, tunnels, and structural civil works.' },
          { id: '3', title: 'Water Resources & Pipelines', icon: 'bi-droplet', description: 'Irrigation canals, supply pipelines, sewerage networks, dams, and treatment plants.' },
          { id: '4', title: 'Industrial Construction', icon: 'bi-gear-wide-connected', description: 'Power plants, heavy manufacturing facilities, refineries, and manufacturing parks.' }
        ]
      }))
    );
  }

  getNews(params?: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/news`, { params }).pipe(
      catchError(() => of({
        success: true,
        data: [
          { id: '1', title: 'United Ram Wins New 120km Highway Contract', category: 'Tenders', date: new Date().toISOString(), summary: 'We are proud to announce the contract award for the regional highway construction project.' },
          { id: '2', title: 'Adopting Drone technology in Project Monitoring', category: 'Innovation', date: new Date().toISOString(), summary: 'Integrating autonomous drone mapping into daily supervision workflows to boost project speed.' }
        ]
      }))
    );
  }

  getCareers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/careers`).pipe(
      catchError(() => of({
        success: true,
        data: []
      }))
    );
  }

  getFaqs(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/faqs`).pipe(
      catchError(() => of({
        success: true,
        data: []
      }))
    );
  }

  getSettings(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/settings`).pipe(
      catchError(() => of({
        success: true,
        data: {}
      }))
    );
  }

  submitContactForm(formValue: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/contact`, formValue);
  }

  submitCareerApplication(fd: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/careers/apply`, fd);
  }

  getGallery(params?: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/gallery`, { params }).pipe(
      catchError(() => of({
        success: true,
        data: [
          { imageUrl: '/malindi2.jpg', caption: 'ZSSF Malindi Car Parking Project Zanzibar', type: 'photo' },
          { imageUrl: '/mbweni-4.png', caption: 'Proposed Sport and Business Facilities at Mbweni', type: 'photo' },
          { imageUrl: '/tunguu1.jpg', caption: 'Warehouse Construction Site at Tunguu Zanzibar', type: 'drone' },
          { imageUrl: '/kengeja.jpg', caption: 'Kengeja Technical Secondary School Hostel Building', type: 'drone' }
        ]
      }))
    );
  }
}
