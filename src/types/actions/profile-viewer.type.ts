interface TProfileViewerBase {
  viewedAt: string | null;
  viewedAgo: string | null;
}

interface TIdentifiedProfileViewer extends TProfileViewerBase {
  viewerType: 'identified';
  name: string;
  publicUrl: string;
  urn: string | null;
  headline: string | null;
  connectionDegree: 1 | 2 | 3 | null;
  avatarUrl: string | null;
}

interface TAnonymousProfileViewer extends TProfileViewerBase {
  viewerType: 'anonymous';
  description: string;
  searchUrl: string;
}

export type TProfileViewer = TIdentifiedProfileViewer | TAnonymousProfileViewer;
