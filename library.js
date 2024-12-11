// Довідник API Velo: https://www.wix.com/velo/reference/api-overview/introduction

$w.onReady(function () {

	// Напишіть тут код Javascript за допомогою API фреймворку Velo

	// Виведіть у консоль фразу «Hello, World!»:
	// console.log("Hello world!");

	// Викликайте функції на елементах сторінки, наприклад:
	// $w("#button1").label = "Натисніть!";

	// Натисніть «Виконати» або «Перегляд сайту», щоб виконати код



});

// Додаємо необхідні модулі Wix Velo
import { fetch } from 'wix-fetch';

// ID таблиці Google Sheets (отримайте його з URL вашої таблиці)
const SHEET_ID = '1gjioNmhhA_tUjtymj0UXYDkcVWVF8ai_dJjYHVP4QWU';

// API ключ (отриманий через Google Cloud Console)
const API_KEY = 'AIzaSyBw_FDvH0CpSDPhSJYMm95q0Poz-fgKv6s';

// Функція для отримання всіх книг з Google Sheets
export function getAllBooks() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1?key=${API_KEY}`;

    return fetch(url, {
        method: 'GET',
    })
    .then((httpResponse) => {
        if (httpResponse.ok) {
            return httpResponse.json();
        } else {
            return Promise.reject('Failed to get data from Google Sheets');
        }
    })
    .then((jsonData) => {
        const books = jsonData.values;

        // Перевіряємо, чи є дані в таблиці
        if (books && books.length > 1) { // Перевірка на наявність більше ніж 1 рядка
            return books.slice(1).map((book) => { // Пропускаємо перший рядок
                return {
                    "Title": book[0] || 'Nessun dato',
                    "Author": book[2] || 'Nessun dato',
                    "Topic": book[1] || 'Nessun dato'
                };
            });
        } else {
            return [];
        }
    })
    .catch((error) => {
        console.log(error);
    });
}

// Функція для пошуку книг за запитом
export function searchBooks(searchQuery) {
    return getAllBooks().then((books) => {
        const filteredBooks = books.filter((book) => {
            const title = book.Title.toLowerCase();
            const topic = book.Topic.toLowerCase();
            const author = book.Author.toLowerCase();

            return (
                title.includes(searchQuery.toLowerCase()) ||
                topic.includes(searchQuery.toLowerCase()) ||
                author.includes(searchQuery.toLowerCase())
            );
        });

        return filteredBooks;
    });
}

// Функція для набору тексту по буквам
function typeText(element, text, delay) {
    let index = 0;

    const typingInterval = setInterval(() => {
        if (index < text.length) {
            element.text += text[index];
            index++;
        } else {
            clearInterval(typingInterval);
        }
    }, delay);
}

// При натисканні на кнопку пошуку
$w.onReady(function () {
    $w('#searchButton').onClick(() => {
        const searchQuery = $w('#searchInput').value;
        $w('#resultsText').text = ''; // Очищаємо текст перед набором
        typeText($w('#resultsText'), 'Cerca...', 50); // Додаємо текст по буквам з затримкою 100 мс

        // Затримка на 1 секунду перед виконанням пошуку
        setTimeout(() => {
            searchBooks(searchQuery).then((books) => {
                $w('#bookTable').rows = [];

                if (books.length > 0) {
                    $w('#bookTable').rows = books;
                } else {
                    $w('#resultsText').text = 'Libri non trovati';
                }
            });
        }, 0.1); // Затримка 1000 мс (1 секунда)
    });

    // При натисканні на кнопку "Показати всі книжки"
    $w('#showAllButton').onClick(() => {
        $w('#resultsText').text = ''; // Очищаємо текст перед набором
        typeText($w('#resultsText'), 'Cerca...', 50); // Додаємо текст по буквам з затримкою 100 мс

        setTimeout(() => {
            getAllBooks().then((books) => {
                if (books.length > 0) {
                    $w('#bookTable').rows = books;
                } else {
                    $w('#resultsText').text = 'Libri non trovati';
                }
            });
        }, 0.1); // Затримка 1000 мс (1 секунда)
    });
});
