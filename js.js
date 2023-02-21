const searchForm = document.querySelector('.search');
const newsList = document.querySelector('.news__list');

let newsArray; // змінна для рендеру
let readNewslist = []; // змінна для прочитанних новин

// Запит на бек за новинами
searchForm.addEventListener('submit', (e) => {
	e.preventDefault();

	getCategoryList(e.target.query.value)
})

async function getCategoryList(query) {
	const fetchApi = await fetch(
		`https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${query}&api-key=A3GIIfyPWHBvfJdoXANwrFAEAGEQbzXw`
	);
	const response = await fetchApi.json();
	const news = response.response.docs;
	newsArray = news;
	newsListRender(news)
}

// Рендер списку. Для тегу a додала дата-атрибут с id
function newsListRender(arr) {
	const listMarkup = arr.map(({ _id, abstract, web_url }) => {
		return `<li id="${_id}">
			<h3>${abstract}</h3>
			<a class="link" href='${web_url}' target="_blank" data-id="${_id}">Read more</a>
		</li>`
	})

	newsList.innerHTML = listMarkup;
}

// Клік по посиланню та додавання у localStorage
newsList.addEventListener('click', ({ target }) => {

	if (target.nodeName === "A") {
		// Знаходимо об'єкт новини з масиву newsArray за допомогою дата-атрибуту
		const id = target.dataset.id;
		const readNews = newsArray.find(item => item._id === id)

		// Читаємо масив з localStorage
		const storageData = localStorage.getItem("readNews")

		// Якщо в localStorage не пустий розпилюємо все що є та додаємо readNews
		if (storageData) {
			readNewslist = [...JSON.parse(storageData), readNews];
		} else {
			readNewslist.push(readNews);
		}

		// Сетимо у localStorage
		localStorage.setItem("readNews", JSON.stringify(readNewslist));
	}
})
