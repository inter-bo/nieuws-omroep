import { NewsCategory } from '@/types/news';

export const defaultCategories: NewsCategory[] = [
  {
    id: 'drenthe',
    name: 'Drenthe',
    feeds: [
      {
        id: 'rtvdrenthe',
        name: 'RTV Drenthe',
        url: 'https://www.rtvdrenthe.nl/rss/index.xml',
        enabled: true
      }
    ]
  },
  {
    id: 'flevoland',
    name: 'Flevoland',
    feeds: [
      {
        id: 'omroepflevoland',
        name: 'Omroep Flevoland',
        url: 'https://www.omroepflevoland.nl/RSS/rss.aspx',
        enabled: true
      },
      {
        id: 'lokaleomroepzeewolde',
        name: 'Lokale Omroep Zeewolde',
        url: 'https://www.lokaleomroepzeewolde.nl/?format=feed&type=rss',
        enabled: true
      },
      {
        id: 'flevopost',
        name: 'Flevopost',
        url: 'https://flevopost.nl/api/feed/rss',
        enabled: true
      }
    ]
  },
  {
    id: 'friesland',
    name: 'Friesland',
    feeds: [
      {
        id: 'omropfryslan',
        name: 'Omrop Fryslan',
        url: 'https://www.omropfryslan.nl/rss/nieuws.xml',
        enabled: true
      },
      {
        id: 'frieschdagblad',
        name: 'Friesch Dagblad',
        url: 'https://frieschdagblad.nl/api/feed/rss',
        enabled: true
      },
      {
        id: 'lc',
        name: 'Leeuwarder Courant',
        url: 'https://lc.nl/api/feed/rss',
        enabled: true
      }
    ]
  },
  {
    id: 'groningen',
    name: 'Groningen',
    feeds: [
      {
        id: 'rtvnoord',
        name: 'RTV Noord',
        url: 'https://www.rtvnoord.nl/rss/index.xml',
        enabled: true
      },
      {
        id: 'dvhn',
        name: 'DVHN',
        url: 'https://dvhn.nl/api/feed/rss',
        enabled: true
      }
    ]
  },
  {
    id: 'gelderland',
    name: 'Gelderland',
    feeds: [
      {
        id: 'omroepgelderland',
        name: 'Omroep GLD',
        url: 'https://www.gld.nl/rss/index.xml',
        enabled: true
      },
      {
        id: 'gelrenieuws',
        name: 'Gelre Nieuws',
        url: 'https://www.gelrenieuws.nl/feed',
        enabled: true
      }
    ]
  },
  {
    id: 'limburg',
    name: 'Limburg',
    feeds: [
      {
        id: 'l1',
        name: 'L1',
        url: 'https://www.l1nieuws.nl/rss/index.xml',
        enabled: true
      },
      {
        id: 'sittardgeleennieuws',
        name: 'Sittard-Geleen Nieuws',
        url: 'https://sittard-geleen.nieuws.nl/sitemap/news.xml',
        enabled: true
      }
    ]
  },
  {
    id: 'noord-brabant',
    name: 'Noord-Brabant',
    feeds: [
      {
        id: 'omroepbrabant',
        name: 'Omroep Brabant',
        url: 'https://www.omroepbrabant.nl/rss',
        enabled: true
      },
      {
        id: '112brabant',
        name: '112 Brabant',
        url: 'https://112brabant.nl/feed/',
        enabled: true
      },
      {
        id: '112brabantnieuws',
        name: '112 Brabant Nieuws',
        url: 'https://www.112brabantnieuws.nl/rss',
        enabled: true
      },
      {
        id: 'bredavandaag',
        name: 'Breda Vandaag',
        url: 'https://www.bredavandaag.nl/rss',
        enabled: true
      }
    ]
  },
  {
    id: 'noord-holland',
    name: 'Noord-Holland',
    feeds: [
      {
        id: 'at5',
        name: 'AT5',
        url: 'https://rss.at5.nl/rss',
        enabled: true
      },
      {
        id: 'haarlemupdates',
        name: 'Haarlem Updates',
        url: 'https://www.haarlemupdates.nl/feed/',
        enabled: true
      },
      {
        id: 'nhnieuws',
        name: 'NH Nieuws',
        url: 'https://rss.nhnieuws.nl/rss',
        enabled: true
      },
      {
        id: 'provincienh',
        name: 'Provincie Noord-Holland',
        url: 'https://www.noord-holland.nl/pnhnieuws',
        enabled: true
      },
      {
        id: 'noordkop247',
        name: 'Noordkop 247',
        url: 'https://noordkop247.nl/feed/',
        enabled: true
      }
    ]
  },
  {
    id: 'overijssel',
    name: 'Overijssel',
    feeds: [
      {
        id: 'rtvoost',
        name: 'OOST.nl',
        url: 'https://www.oost.nl/rss/index.xml',
        enabled: true
      },
      {
        id: '1twente',
        name: '1Twente',
        url: 'https://www.1twente.nl/feed/twente',
        enabled: true
      },
      {
        id: '1zwolle',
        name: '1Zwolle',
        url: 'https://1zwolle.nl/feed',
        enabled: true
      }
    ]
  },
  {
    id: 'utrecht',
    name: 'Utrecht',
    feeds: [
      {
        id: 'rtvutrecht',
        name: 'RTV Utrecht',
        url: 'https://www.rtvutrecht.nl/rss/nieuws.xml',
        enabled: true
      },
      {
        id: 'duic',
        name: 'DUIC',
        url: 'https://www.duic.nl/rss',
        enabled: true
      },
      {
        id: 'nieuwsutrecht',
        name: 'Nieuws Utrecht',
        url: 'https://utrecht.nieuws.nl/sitemap/news.xml',
        enabled: true
      },
      {
        id: 'centrumutrecht',
        name: 'Centrum Utrecht',
        url: 'https://centrumutrecht.nl/nieuws/feed/',
        enabled: true
      }
    ]
  },
  {
    id: 'zeeland',
    name: 'Zeeland',
    feeds: [
      {
        id: 'omroepzeeland',
        name: 'Omroep Zeeland',
        url: 'https://www.omroepzeeland.nl/rss/index',
        enabled: true
      }
    ]
  },
  {
    id: 'zuid-holland',
    name: 'Zuid-Holland',
    feeds: [
      {
        id: 'omroepwest',
        name: 'Omroep West',
        url: 'https://www.omroepwest.nl/rss/index.xml',
        enabled: true
      },
      {
        id: 'rijnmond',
        name: 'Rijnmond',
        url: 'https://www.rijnmond.nl/rss/index.xml',
        enabled: true
      }
    ]
  }
]; 