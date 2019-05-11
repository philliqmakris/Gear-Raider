
$(document).ready(function() {
  if (!document.cookie) {
    return $('#newPostContent').html('You must be logged in to post a review');
  }

	$('#submitButton').click(() => {
		const review = {
			product: $('#productName').val(),
			rating: $('#rating').val(),
			imgUrl: $('#imageUrl').val(),
			text: $('#info').val(),
		};

	  const token = getCookie('token');

	  fetch('http://localhost:3000/api/reviews', {
	    method: 'POST',
	    mode: 'cors',
	    headers: {
	      "Content-Type": "application/json",
	      'x-auth-token': token,
	    },
	    body: JSON.stringify(review),
	  })
	    .then(async res => {
	      if (res.status !== 200) throw new Error(res.status + ' ' + await res.text());
	      return res.json();
	    })
	    .then(
	      result => {
	        window.location.href = "index.html";
	      },
	      error => {
	        console.log(error)
	      }
	    );
	});	
});