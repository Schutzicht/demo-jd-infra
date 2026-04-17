export const siteConfig = {
  name: 'JD Infra Aannemingsbedrijf BV',
  shortName: 'JD Infra',
  tagline: 'Vakmanschap in grondwerk, straatwerk en buitenriolering',
  description: 'JD Infra is een bedrijf met ruime ervaring op het gebied van grondwerk, straatwerk en buitenriolering. Wij realiseren zowel kleine als grote projecten voor particulieren, bedrijven en overheidsinstellingen.',
  url: 'https://www.jdinfra.nl',

  contact: {
    address: 'Karreveld 52',
    postalCode: '4371 GA',
    city: 'Koudekerke',
    country: 'Nederland',
    phone: '0118-563535',
    email: 'info@jdinfra.nl',
  },

  founded: 2006,
  employees: '12-15',

  navigation: [
    { label: 'Home', href: '/' },
    {
      label: 'Diensten', href: '/diensten/',
      children: [
        { label: 'Straatwerk', href: '/diensten/straatwerk/' },
        { label: 'Riolering', href: '/diensten/riolering/' },
        { label: 'Grondwerk', href: '/diensten/grondwerk/' },
      ],
    },
    { label: 'Projecten', href: '/projecten/' },
    { label: 'Over ons', href: '/over-ons/' },
    { label: 'Vacatures', href: '/vacatures/' },
    { label: 'Contact', href: '/contact/' },
  ],

  diensten: [
    {
      title: 'Straatwerk',
      slug: 'straatwerk',
      description: 'Straatwerk wordt door JD Infra uitgevoerd door ervaren en gediplomeerde vakmensen. Zowel grote als kleine oppervlakken straatwerk worden door ons aangelegd.',
      image: '/fotos-jd-infra/fotos jd infra/IMG_2694c-600x500.jpg.jpeg',
    },
    {
      title: 'Riolering',
      slug: 'riolering',
      description: 'Rioleringswerk wordt door JD Infra uitgevoerd en heeft betrekking op het nieuw aanleggen en onderhouden van compleet rioleringswerk. Wij verzorgen alle soorten riolering ten behoeve van nieuwbouw en reconstructie.',
      image: '/fotos-jd-infra/fotos jd infra/Foto-16-11-18-11-08-11zp-579x500.jpg.jpeg',
    },
    {
      title: 'Grondwerk',
      slug: 'grondwerk',
      description: 'Grondwerk wordt door JD Infra uitgevoerd ten behoeve van beschoeiingen, bermen, grondwal en wegfundering.',
      image: '/fotos-jd-infra/fotos jd infra/fotos-rittenburg-381z-576x500.jpg.jpeg',
    },
  ],

  projecten: [
    { title: 'Offenbachlaan Vlissingen', image: '/fotos-jd-infra/fotos jd infra/HeadOff-1024x288.jpg.jpeg', date: '2018-07-18' },
    { title: 'Tandzorg Schot Middelburg', image: '/fotos-jd-infra/fotos jd infra/HeadSchot-1024x288.jpg.jpeg', date: '2018-07-18' },
    { title: 'Rotonde Meliskerke', image: '/fotos-jd-infra/fotos jd infra/DSC_2305-1024x680.jpg.jpeg', date: '2016-09-15' },
  ],
} as const;
