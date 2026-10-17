import { BOOK_TITLE, SITE_URL, AUTHOR, PUBLISHER, OG_IMAGE, CHECKOUT_OPEN } from '../config';

// One description for the Book node on every page. (Base.astro used to pass the
// page's own description, so the Book's description changed from page to page.)
export const BOOK_DESCRIPTION =
  'A field guide for a world where machines think. An interview-driven study of coordination, the third body between hardware and software.';

export const BOOK_ID = `${SITE_URL}/#book`;

// Verified links only. Add Goodreads, Open Library, Google Books, WorldCat or
// Wikidata here when those records exist, so the entity points at them.
const SAME_AS = ['https://github.com/fromknowware/systems-intelligence'];

export function bookNode(ogImage: string = OG_IMAGE, description: string = BOOK_DESCRIPTION) {
  return {
    '@type': 'Book',
    '@id': BOOK_ID,
    name: BOOK_TITLE,
    author: { '@type': 'Person', name: AUTHOR },
    publisher: { '@type': 'Organization', name: PUBLISHER },
    url: SITE_URL,
    image: ogImage,
    description,
    inLanguage: 'en',
    sameAs: SAME_AS,
    // No datePublished: the book is not published until December 21, 2026, and
    // schema.org's datePublished is the date of first publication.
    // No isbn: none has been assigned. When one exists it goes on a workExample
    // (bookFormat + isbn), not on the Book itself.
    // No Offer until a real checkout exists: a price marked available
    // for a book nobody can order would be a false signal to agents.
    ...(CHECKOUT_OPEN ? { offers: { '@type': 'Offer', price: '33.00', priceCurrency: 'USD', availability: 'https://schema.org/PreOrder', url: `${SITE_URL}/order` } } : {}),
  };
}
