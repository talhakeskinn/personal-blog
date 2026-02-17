import { TagIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const categoryType = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  icon: TagIcon,
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
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
      },
    }),
    defineField({
      name: 'description',
      type: 'text',
    }),
    defineField({
      name: 'parent',
      title: 'Üst Kategori (Parent)',
      description: 'Bu kategori bir ana başlığın altındaysa, buradan seçin (Örn: Yazılım -> Teknoloji)',
      type: 'reference',
      to: [{ type: 'category' }],
    }),
  ],
})
