import type { TNvAlertSubject } from './nv-alert-subject.type';

export interface TNvAlert {
  id: string;
  type: string;
  publishedAt: string;
  subject: TNvAlertSubject;
  headline: string | null;
  text: string | null;
  subline: string | null;
  url: string | null;
  relatedEntityUrn: string | null;
}
