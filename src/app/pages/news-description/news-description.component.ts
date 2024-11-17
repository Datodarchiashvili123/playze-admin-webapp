import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnnouncementItemModel } from '../../shared/models/announcement-item.model';
import { AnnouncementService } from '../announcement/announcement.service';

@Component({
  selector: 'app-news-description',
  standalone: true,
  imports: [NgOptimizedImage, CommonModule],
  templateUrl: './news-description.component.html',
  styleUrl: './news-description.component.scss'
})
export class NewsDescriptionComponent implements OnInit {
  private _announcementService = inject(AnnouncementService);
  newsData!: AnnouncementItemModel;

  ngOnInit(): void {
  }
}
