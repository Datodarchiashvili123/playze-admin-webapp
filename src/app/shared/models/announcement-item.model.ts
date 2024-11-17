import { AnnouncementTypeModel } from './announcement-type.model';

export interface AnnouncementItemModel {
  id: string;
  headline: string;
  primaryKeyword: string;
  image: string;
  isPublished: boolean;
  publishedTime: string;
  createTime: string;
  type: AnnouncementTypeModel;
}
