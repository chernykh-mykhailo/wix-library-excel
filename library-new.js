Thank you for providing the screenshot. Let's analyze the issue and identify the problem.

### Observations:
1. **Empty Rows**: There are empty rows in the table, which might be causing issues in processing the data correctly.
2. **Section Headers**: The section headers (e.g., "AGRARIA", "ARTE") are present, but the code might not be correctly identifying these sections.
3. **Data Extraction**: The data extraction might be incomplete or incorrect due to the empty rows and section headers.

### Possible Issues:
1. **Empty Rows Handling**: The code might be skipping rows incorrectly, leading to incomplete data extraction.
2. **Section Identification**: The code might not be correctly identifying the sections, leading to incomplete data processing.

### Steps to Fix:
1. **Handle Empty Rows**: Ensure that the code correctly skips empty rows and processes only non-empty rows.
2. **Identify Sections**: Ensure that the code correctly identifies the section headers and processes each section separately.

### Updated Approach:
We'll update the code to handle empty rows correctly and ensure that each section is processed separately. We'll also add some logging to help debug any issues.

### Updated Code:
```javascript
import { fetch } from 'wix-fetch';

const SHEET_ID = 'YOUR_SHEET_ID'; // Replace with your actual Sheet ID
const API_KEY = 'YOUR_API_KEY'; // Replace with your actual API Key

// Function to fetch all books from Google Sheets
export function getAllBooks() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Folha1?key=${API_KEY}`;

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

        // Check if there is data in the table
        if (books && books.length > 0) { // Check for data
            let allBooks = [];

            // Process each section separately
            for (let i = 0; i < books.length; i++) {
                // Skip empty rows
                if (books[i].every(cell => cell === '' || cell === null || cell === undefined)) {
                    continue;
                }

                if (books[i][0] === 'ISBN' && books[i][1] === 'TITLE' && books[i][2] === 'AUTHOR' && books[i][3] === 'TOPIC' && books[i][4] === 'SECTION') {
                    // Found a new section header
                    let sectionBooks = [];
                    i++; // Skip the empty row after the header
                    while (i < books.length && !books[i].every(cell => cell === '' || cell === null || cell === undefined)) {
                        let book = {
                            "Title": books[i][1] || '-',
                            "Author": books[i][2] || '-',
                            "Topic": books[i][3] || '-',
                            "Section": books[i][4] || '-'
                        };
                        sectionBooks.push(book);
                        i++;
                    }
                    allBooks = allBooks.concat(sectionBooks);
                }
            }

            return allBooks;
        } else {
            return []; // Return an empty array if no data is found
        }
    })
    .catch((error) => {
        console.log(error);
        return []; // Return an empty array on error
    });
}

// Function to search for books based on a query
export function searchBooks(searchQuery) {
    return getAllBooks().then((books) => {
        const filteredBooks = books.filter((book) => {
            const title = book.Title.toLowerCase();
            const topic = book.Topic.toLowerCase();
            const author = book.Author.toLowerCase();
            const section = book.Section.toLowerCase(); // Include section filter

            return (
                title.includes(searchQuery.toLowerCase()) ||
                topic.includes(searchQuery.toLowerCase()) ||
                author.includes(searchQuery.toLowerCase()) ||
                section.includes(searchQuery.toLowerCase()) // Include section filter
            );
        });

        return filteredBooks;
    });
}

// Function for typing text effect
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

// On button click for search
$w.onReady(function () {
    $w('#searchButton').onClick(() => {
        const searchQuery = $w('#searchInput').value;
        $w('#resultsText').text = ''; // Clear text before typing
        typeText($w('#resultsText'), 'Cerca...', 50); // Add text with delay

        // Delay before performing search
        setTimeout(() => {
            searchBooks(searchQuery).then((books) => {
                $w('#bookTable').rows = [];

                if (books.length > 0) {
                    $w('#bookTable').rows = books;
                } else {
                    $w('#resultsText').text = 'Libri non trovati';
                }
            });
        }, 50); // Increased delay to 50 milliseconds
    });

    // On button click to show all books
    $w('#showAllButton').onClick(() => {
        $w('#resultsText').text = ''; // Clear text before typing
        typeText($w('#resultsText'), 'Cerca...', 50); // Add text with delay

        setTimeout(() => {
            getAllBooks().then((books) => {
                if (books.length > 0) {
                    $w('#bookTable').rows = books;
                } else {
                    $w('#resultsText').text = 'Libri non trovati';
                }
            });
        }, 50); // Increased delay to 50 milliseconds
    });
});
```

### Explanation:
1. **Fetching Data**: The `getAllBooks` function fetches data from the Google Sheets API and processes it to extract the title, author, topic, and section for each book.
2. **Processing Data**: The code processes each section separately by looking for section headers (ISBN, TITLE, AUTHOR, TOPIC, SECTION) and extracting the relevant information from each section. It skips empty rows.
3. **Combining Results**: The results from all sections are combined into a single array of books.
4. **Returning a Default Value**: The function now always returns an array, even if it's empty or if an error occurs.
5. **Searching Data**: The `searchBooks` function filters the books based on the search query, considering the title, author, topic, and section.
6. **Displaying Data**: The `typeText` function adds a typing effect to the search results text. The `setTimeout` function delays the search execution to allow the typing effect to complete.

This code should now correctly fetch data from your entire Google Sheets table and display the search results on your website. If you encounter any specific errors, please provide the error messages for further assistance.