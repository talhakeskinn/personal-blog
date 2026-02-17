import { DocumentTextIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'language',
      type: 'string',
      readOnly: false,
      hidden: false,
      initialValue: 'tr',
      options: {
        list: [
          { title: 'Türkçe', value: 'tr' },
          { title: 'English', value: 'en' },
        ],
      },
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      description: 'Short summary for cards and previews.',
    }),
    defineField({
      name: 'isHeadline',
      title: 'Manşet Kartı (Headline)',
      type: 'boolean',
      description: 'Aktif edilirse bu yazı ana sayfada en üstte büyük kart olarak görünür.',
      initialValue: false,
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
      },
    }),
    defineField({
      name: 'author',
      type: 'reference',
      to: { type: 'author' },
    }),
    defineField({
      name: 'mainImage',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        })
      ]
    }),
    defineField({
      name: 'categories',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: { type: 'category' } })],
    }),
    defineField({
      name: 'theme',
      title: 'Theme',
      type: 'string',
      description: 'Primary theme for this post.',
      options: {
        list: [
          { title: 'Technology', value: 'technology' },
          { title: 'Career', value: 'career' },
          { title: 'Learning', value: 'learning' },
          { title: 'Mythology', value: 'mythology' },
          { title: 'Hobbies', value: 'hobbies' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
    }),
    defineField({
      name: 'body',
      type: 'blockContent',
    }),
    defineField({
      name: 'likes',
      title: 'Beğeni Sayısı',
      type: 'number',
      initialValue: 0,
      readOnly: true, // Elle değiştirilmesin, sadece API artırsın
      description: 'Bu alan okuyucuların beğeni sayısını tutar.',
    }),
    defineField({
      name: 'views',
      title: 'Görüntülenme Sayısı',
      type: 'number',
      initialValue: 0,
      readOnly: true,
      description: 'Bu yazı kaç kez okundu.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const { author } = selection
      return { ...selection, subtitle: author && `by ${author}` }
    },
  },
})
