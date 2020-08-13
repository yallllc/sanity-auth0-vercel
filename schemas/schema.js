import schemaTypes from 'all:part:@sanity/base/schema-type';
import createSchema from 'part:@sanity/base/schema-creator';
import about from './documents/about';
import author from './documents/author';
import category from './documents/category';
import post from './documents/post';
import siteSettings from './documents/siteSettings';
import authorReference from './objects/authorReference';
import bioPortableText from './objects/bioPortableText';
import bodyPortableText from './objects/bodyPortableText';
import excerptPortableText from './objects/excerptPortableText';
import mainImage from './objects/mainImage';

export default createSchema({
  name: 'main',
  types: schemaTypes.concat([
    siteSettings,
    about,
    post,
    category,
    author,
    mainImage,
    authorReference,
    bodyPortableText,
    bioPortableText,
    excerptPortableText,
  ]),
});
