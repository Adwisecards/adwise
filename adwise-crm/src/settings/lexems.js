export default {
  pages: {
    signUpStart: {
      headerTitle: "Создать аккаунт {{br}} для своего бизнеса",
      headerDescription:
        "Бесплатный доступ к полному функционалу AdWise на 7 дней",
    },
    signUpSteps: {
      title: "Регистрация компании",
    },
  },
  forms: {
    information: {
      about: {
        name: {
          label: "Название",
          description: "Указывается без правовой формы",
        },
        annotation: {
          label: "Аннотация",
          description: "Опишите деятельность вашей компании",
        },
        description: {
          label: "Описание",
          description:
            "Подробная информация о компании.\n Адреса, контактные данные и режим работы указываются во вкладке {link}",
        },
        phone: {
          label: "Телефон",
        },
        currency: {
          label: "Валюта",
        },
        category: {
          label: "Категория",
        },
        tags: {
          label: "Теги",
        },
        mainButton: {
          label: "Главная кнопка",
        },
        mainButtonName: {
          label: "Название кнопки",
        },
        mainButtonLink: {
          label: "Ссылка",
        },
        mainButtonDescription: {
          label: "Описание",
        },
        links: {
          name: {
            label: "Название ссылки",
          },
          link: {
            label: "Ссылка",
          },
        },
      },
      addBranch: {
        address: { label: "Адрес" },
        addressRefine: { label: "Уточнение адреса" },
        branchName: { label: "Название филиала" },
        phone: { label: "Телефон" },
        shedule: {
          label: "Режим работы",
        },
        fulltime: { label: "Круглосуточно" },
      },
      photos: {
        dropFile: "Перетащите фотографии для загрузки",
        dropFileDescription:
          "Можно загрузить 10 фотографий JPG или PNG, минимальное разрешение 540*480рх, размер не более 3Мбайт.",
        chooseFiles: "Выбрать файлы",
      },
    },
    stock: {
      create: {
        pagetitle: "Новая акция",
        name: "Название",
        description: "Описание",
        category: "Категория",
        categoryPlaceholder: "Выберите категорию",
        priceGroup: "Стоимость",

        stockProduct: "Акционный товар",
        loyaltyOff: "Не применять бонусную программу ",
        loyaltyOffTooltip: "Всплывающая подсказка",

        variantsPrice: "Цена",
        variantsPrice: "Акционная",
        variantsPrice: "Артикул",
        variantsAddButton: "Добавить вариант",

        variants: {
          schema: {
            name: { label: "Название варианта" },
            price: { label: "Цена" },
            discountPrice: { label: "АКционная" },
            code: { label: "Артикул" },
          },
          addButton: "Добавить вариант",
        },

        photos: "Фотографии",
        photosDescription:
          "Можно загрузить еще 5 фотографий JPG или PNG, минимальное разрешение 400*400рх, размер не более 3мб",
      },
    },
    signIn: {
      login: {
        label: "Логин",
      },
      password: {
        label: "Пароль",
      },
    },
    signUp: {
      firstName: {
        label: "Имя",
      },
      lastName: {
        label: "Фамилия",
      },
      phone: {
        label: "Телефон",
      },
      email: {
        label: "E-mail",
      },
      password: {
        label: "Пароль",
      },
      confirmPassword: {
        label: "Подтвердите пароль",
      },
      country: {
        label: "Страна пребывания",
      },
      privacyPolicy: {
        label:
          "Я ознакомился с {link:Политикой конфиденциальности} и принимаю ее условия.",
      },
      offerAgreement: {
        label: "Я ознакомился и принимаю {link:Условия оферты}",
      },

      description: {
        label: "Описание",
        description:
          "Подробная информация о компании.\n Адреса, контактные данные и режим работы указываются во вкладке {link}",
      },
      phone: {
        label: "Телефон",
      },
      currency: {
        label: "Валюта",
      },
      category: {
        label: "Категория",
      },
    },
    signUpStep1: {
      name: { label: "Название" },
      annotation: { label: "Аннотация" },
      category: { label: "Категория" },
      tags: { label: "Теги" },
    },
  },
};
