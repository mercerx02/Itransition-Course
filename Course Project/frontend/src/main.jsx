import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { BACKEND_URL , CLIENT_URL} from "./const.js";

const selectedLanguage = localStorage.getItem('lang');


i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          "recomendations": "Reviews",
          "trends":"Trends",
          "recent":"Recent",
          "likes":"By likes count",
          "piece":"Piece",
          'group':'Group',
          "author's rating": "Author's rating",
          "piece rating": "Piece rating",
          "log out":"Log Out",
          'profile':'Profile',
          'admin':"Admin",
          'admin page': "Admin page",
          'total likes':'Total likes',
          'avg rating':'Avg. rating',
          'my profile':'My profile',
          'search':'Search',
          'admin notion':'Create an overview as an administrator',
          'review name':'Review name',
          'tags':'Tags',
          'review text':'Review text',
          'my rating':'My rating',
          'img text':'Choose an image to review',
          'pdf': 'Export to PDF',
          'block':'This is not your account or you have been blocked',
          'not_your_review':'You have no rights to edit this review!',
          'create_review':'The review has been created succesfully!',
          'edit_review':'The review has been edited succesfully!',
          'by_avg_rating':'By avg. rating',
          'delete_success':'The review has been deleted succesfully!',
          'game':'Game',
          'cinema':'Cinema',
          'book':'Book',
          'sport':'Sport',
          'tech':'Technology',
          'other':'Other',
          'liked_reviews':'By liked reviews',
          'no_reviews':'No reviews ):',
          'my_reviews':'My reviews'

        }
      },
      ru: {
        translation: {
          "recomendations": "Обзоры",
          "trends":"Тренды",
          "recent":"Недавние",
          "likes":"По кол-ву лайков",
          "piece":"Произведение",
          'group':'Группа',
          "author's rating": "Оценка автора",
          "piece rating": "Рейтинг произведения",
          "log out":"Выйти",
          'profile':'Профиль',
          'admin':"Админ",
          'admin page': "Администраторская",
          'total likes':'Мои лайки',
          'avg rating':'Сред. рейтинг',
          'my profile':'Мой профиль',
          'search':'Поиск',
          'admin notion':'Создание обзора от мени администратора',
          'review name':'Название обзора',
          'tags':'Теги',
          'review text':'Текст обзора',
          'my rating':'Моя оценка',
          'img text':'Выберите изображение к обзору',
          'pdf': 'Эскпорт в PDF',
          'block':'Это не ваш аккаунт или вы были заблокированны!',
          'not_your_review':'У вас нет разрешения для редактирования данного обзора!',
          'create_review':'Обзор успешно был создан!',
          'edit_review':'Обзор успешно был изменен!',
          'by_avg_rating':'По среднему рейтингу',
          'game':'Игра',
          'cinema':'Фильм',
          'book':'Книга',
          'sport':'Спорт',
          'tech':'Технологии',
          'other':'Другое',
          'delete_success':'Обзор был удален успешно!',
          'liked_reviews':'Понравившееся обзоры',
          'no_reviews':'Обзоров нет ):',
          'my_reviews':'Мои обзоры'


        }
      }
    },
    lng: selectedLanguage || 'en',
    fallbackLng: "en",

    interpolation: {
      escapeValue: false
    }
  });


ReactDOM.createRoot(document.getElementById('root')).render(
    <App BACKEND_URL={BACKEND_URL} CLIENT_URL={CLIENT_URL} />
)
