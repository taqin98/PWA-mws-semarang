(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        
		const imgRequest = new XMLHttpRequest();
		imgRequest.onload = addImage;
		imgRequest.onerror = function (err){
			requestErr('err', 'image');
		};

		imgRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
		imgRequest.setRequestHeader('Authorization', 'Client-ID e1f37f06da831fca496734df5951334c375cd3a72a91482c84bf4065e135c1d6');
		imgRequest.send();


		const articleRequest = new XMLHttpRequest();
		articleRequest.onload = addArticles;
		articleRequest.onerror = function (err){
			requestErr('err','articles');
		};

		articleRequest.open('GET',`https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=c479603351d444c49a5cfbca0c0b544b`);
		articleRequest.send();


		function addImage(){
			let htmlContent = '';
			const data = JSON.parse(this.responseText);

			if (data && data.results && data.results[0]){
				const firstImage = data.results[0];
				htmlContent = 
				`<figure>
					<img src="${firstImage.urls.regular}" alt="${searchedForText}">
					<figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
				</figure>`;
			} else {
				htmlContent = '<div class="error-no-image">No image available</div>'
			}

			responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
		}

		function addArticles(){
			let htmlContent = '';
			const data = JSON.parse(this.responseText);

			if (data.response && data.response.docs && data.response.docs.length > 1) {
				htmlContent = '<ul>' + data.response.docs.map(article => `<li class="article">
					<h2><a href="${article.web_url}">${article.headline.main}</a></h2>
					<p>${article.snippet}</p>
					</li>`
					).join('') + '</ul>';
			} else {
				htmlContent = '<div class="error-no-articles">No articles available</div>';
			}

			responseContainer.insertAdjacentHTML('beforeend', htmlContent);
		}

    });
})();


