export default {
  name: 'about',
  type: 'document',
  title: 'About Page',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title',
    },
    {
      name: 'mainImage',
      type: 'mainImage',
      title: 'Main image',
    },
    {
      name: 'body',
      type: 'bodyPortableText',
      title: 'Body',
    },
  ],
};
