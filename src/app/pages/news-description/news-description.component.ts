import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AnnouncementItemModel } from '../../shared/models/announcement-item.model';
import { AnnouncementService } from '../announcement/announcement.service';
import { AnnouncementDescriptionModel, RelatedGame } from './models/announcement-description.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-news-description',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './news-description.component.html',
  styleUrl: './news-description.component.scss',
})
export class NewsDescriptionComponent implements OnInit {
  private _announcementService = inject(AnnouncementService);
  route = inject(ActivatedRoute);
  announcement?: AnnouncementDescriptionModel;
  relatedGames: RelatedGame[] = [];
  imageDomain = environment.bucket;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    this._announcementService.getNewsDetails(id ?? '').subscribe((result) => {
      const data = result.parameters[result.key];

      this.announcement = data as AnnouncementDescriptionModel;
      this.relatedGames = Array.isArray(data.relatedGames)
      ? data.relatedGames
      : [data.relatedGames];

    });
  }
}
