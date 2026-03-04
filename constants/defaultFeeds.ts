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
        id: 'ed',
        name: 'Eindhovens Dagblad',
        url: 'https://www.ed.nl/home/rss.xml',
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
        id: 'lokaleomroepkrimpen',
        name: 'LOK',
        url: 'https://www.lokaleomroepkrimpen.nl/rel4/rssfeed.asp',
        enabled: true
      }
    ]
  }
]; 