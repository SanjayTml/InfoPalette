export const myStructure = (S) =>
  S.list()
    .title('Base')
    .items([
      S.listItem()
        .title('Filtered Posts')
        .child(
          S.list()
            .title('Filters')
            .items([
              S.listItem().title('Posts By Category').child(),
              S.listItem().title('Posts By Author').child(),
            ])
        ),
      ...S.documentTypeListItems().filter(
        (listItem) => !['siteSettings', 'navigation', 'colors'].includes(listItem.getId())
      ),
      S.listItem()
        .title('Posts By Category')
        .child(
          S.documentTypeList('category')
            .title('Posts by Category')
            .child((categoryId) =>
              S.documentList()
                .title('Posts')
                .filter('_type == "post" && $categoryId in categories[]._ref')
                .params({categoryId})
            )
        ),
    ])
