/* eslint-env jquery */

(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;


        $.ajax({
        	headers: {
    			'Authorization': 'Client-ID e1f37f06da831fca496734df5951334c375cd3a72a91482c84bf4065e135c1d6'
    		},
    		url: `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`
		}).done(addImage)
		.fail(function(err){
			requestError(err, 'image');
		});

		$.ajax({
    		url: `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=c479603351d444c49a5cfbca0c0b544b`
		}).done(addArticles)
		.fail(function(err){
			requestError(err, 'article');
		});


		function addImage(images) {
    		const firstImage = images.results[0];
    		
    		responseContainer.insertAdjacentHTML('afterbegin', `<figure>
            		<img src="${firstImage.urls.small}" alt="${searchedForText}">
            		<figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
        		</figure>`
    		);
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
