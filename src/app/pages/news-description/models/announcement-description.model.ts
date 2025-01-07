export interface AnnouncementDescriptionModel {
  contentHtml: string;
  headline: string;
  id: string;
  imgUrl: string;
  primaryKeyword: string;
  published: string;
  publishedBy: string;
  relatedGames: RelatedGame[];
  type: NewsType;
}

export interface RelatedGame {
  currentPrice: string;
  disscountPercent: string;
  imgUrl: string;
  name: string;
  urlName: string;
}

export interface NewsType {
  color: string;
  id: string;
  name: string;
}
