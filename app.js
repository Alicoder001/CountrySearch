const formEl = document.querySelector("form");
const countryInfo = document.getElementById("countryInfo");
const indicatorEl = document.getElementById("indicatorEl");
formEl.addEventListener("submit", (e) => {
	e.preventDefault();
	const cName = formEl.nameEl.value;
	const api = `https://restcountries.com/v3.1/name/${cName}`;
	checker(cName, api);
});
function statusEl(indicator, condition) {
	indicatorEl.style.color = indicator;
	indicatorEl.innerHTML = condition;
}
function loader(data) {
	indicatorEl.innerHTML = `<p class="loadingText">Loading...</p>
	<div class="loader">
		<div class="inner one"></div>
		<div class="inner two"></div>
		<div class="inner three"></div>
	</div>`;
}
function checker(nameEl, api) {
	if (nameEl) {
		if (nameEl.length < 3) {
			statusEl("red", "Iltimos 3 ta belgidan ko'proq kiriting !!!");
			countryInfo.innerHTML = "";
		} else {
			getData(api)
				.then((data) => {
					statusEl("green", "Muvaffaqiyatli bajarildi  !!!");
					updateUL(data);
				})
				.catch((err) => {
					statusEl("red", "Bu nomdagi davlat topilmadi !!!");
					countryInfo.innerHTML = "";
				});
		}
	} else {
		statusEl("red", "Iltimos Mamlakat nomini kiriting !!!");
		countryInfo.innerHTML = "";
	}
}

function getData(recourse) {
	return new Promise((resolve, reject) => {
		const request = new XMLHttpRequest();
		request.addEventListener("readystatechange", () => {
			if (request.readyState < 4) {
				loader(true);
			} else if (request.readyState == 4 && request.status == 200) {
				loader(true);
				resolve(JSON.parse(request.responseText));
			} else if (request.readyState == 4) {
				loader(true);
				reject("error");
			}
		});
		request.open("GET", recourse);
		request.send();
	});
}
function updateUL(data) {
	countryInfo.innerHTML = "";
	data.forEach((item) => {
		const {
			name,
			capital,
			population,
			continents,
			currencies,
			languages,
			flags,
		} = item;
		countryInfo.innerHTML = `
        <div class="main__block">
					<img src="${item.flags.svg}" alt="" />
					<h1 class="country__title">${name.common}</h1>
				</div>
				<div class="info__block">
					<p class="capital__subt subt">
						Capital:
						<span class="capital__value value">${capital}</span>
					</p>
					<p class="continent__subt subt">
						Continent:
						<span class="continent__value value">${continents} </span>
					</p>
					<p class="population__subt subt">
						Population:
						<span class="population__value value">${[
							population.toLocaleString("en-US"),
						]}</span>
					</p>
					<p class="currency__subt subt">
						Currency:
						<span class="currency__value value"
							>${
								currencies
									? `${
											Object.values(currencies)[0].name
									  } - ${Object.keys(currencies)}`
									: ""
							}</span
						>
					</p>
					<p class="lang__subt subt">
						Common Languages:
						<span class="lang__value value"> ${Object.values(languages)}</span>
					</p>
				</div>`;
	});
}
