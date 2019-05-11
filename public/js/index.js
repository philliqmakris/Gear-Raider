const state = {
  reviews: [],
  page: 1,
  baseUrl: "http://localhost:3000/api/",
  reqCooldown: null,
};

// var API = {
//   saveExample: function(example) {
//     return $.ajax({
//       headers: {
//         "Content-Type": "application/json"
//       },
//       type: "POST",
//       url: "api/examples",
//       data: JSON.stringify(example)
//     });
//   },
//   getExamples: function() {
//     return $.ajax({
//       url: "api/examples",
//       type: "GET"
//     });
//   },
//   deleteExample: function(id) {
//     return $.ajax({
//       url: "api/examples/" + id,
//       type: "DELETE"
//     });
//   }
// };

$(document).ready(function() {
  getReviews();

  if (document.cookie) {
    const username = getCookie('username');
    $('#loginArea').text('Welcome, ' + username + ' ');

    const logoutBtn = $(`
      <button>logout</button>
    `)
      .click(() => {
        document.cookie = "token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
        document.cookie = "username=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;"
        document.location.reload(false);
      });

    $('#loginArea').append(logoutBtn);
  }

  $('#searchButton').click(() => {
    const searchTerm = $('#searchInput').val();
    const query = { product: searchTerm }
    
    getReviews(query);
  });
});

// prevent spam clicking search, etc
function resetCooldown() {
  state.reqCooldown = true;
  setTimeout(() => state.reqCooldown = false, 1000);
}

function getReviews(query = {}) {
  if (state.reqCooldown) return;
  resetCooldown();

  const token = getCookie('token');

  let queryString = '';
  for (let term in query) {
    queryString += `?${term}=${query[term]}`;
  }

  fetch(state.baseUrl + 'reviews' + queryString, {
    method: 'GET',
    mode: 'cors',
    headers: {
      "Content-Type": "application/json",
      'x-auth-token': token,
    }
  })
    .then(async res => {
      if (res.status !== 200) throw new Error(res.status + ' ' + await res.text());
      return res.json();
    })
    .then(
      result => {
        const reviews = result.reviews || [];
        state.reviews = reviews;
        populateTiles(state.reviews);
      },
      error => {
        console.log(error)
      }
    );
}

function populateTiles(reviews) {
  $('.tileArea').html('');

  reviews.forEach((review, index) => {
    const tileAreaId = (index % 2 === 0) ? 'tileAreaL' : 'tileAreaR';
    const tile = $(`
      <div class="tile" data-reviewIndex="${index}" >
        <span class="tileProduct">${review.product}</span>
        <img class="itemImage" src="${review.imgUrl}">
      </div>
    `);

    tile.click(function() {
      const reviewIndex = $(this).attr('data-reviewIndex')
      showReview(reviewIndex)
    });

    $('#' + tileAreaId).append(tile)
  });
}

function showReview(reviewIndex) {
  const review = state.reviews[reviewIndex];
  
  $('#prodTitle').text(review.product);
  $('#userName').text('User: ' + review.User.username);
  $('#userRating').text(`Rating: ${review.rating}/5`);
  $('#productInfo').text(review.text);
  $('#userImage').attr('src', review.imgUrl);
}

$('#loginLink').click(showLogin);

function showLogin() {
  const html = `
    <span class="loginText">User Name:</span>
    <input id="userNameInput" class="jqHeadInput type="text" placeholder="Username">
    <br />
    <span class="loginText">Password:</span>
    <input id="passwordInput" class="jqHeadInput" type="password" placeholder="password">
    <button onclick="logIn()" class="signInButt" type="submit">
      Log In
    </button>
  `;
  $('#loginArea').html(html);
};

const loggedIn = () => {
  

  // sendLoginRequest(username, password);
  const signedIn = `
    <span class="back">Signed In As: ${username}</span>
    <div>
      <a class="signOut" href="index.html">Sign Out</a>
    </div>
  `;
  $('#loginArea').html(signedIn);
};

function logIn(query = {}) {
  if (state.reqCooldown) return;
  resetCooldown();

  let username = $('#userNameInput').val();
  let password = $('#passwordInput').val();

  $('#userNameInput').val('');
  $('#passwordInput').val('');

  fetch(state.baseUrl + 'auth', {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })
    .then(async res => {
      if (res.status === 400) {
        $('#loginArea').text('invalid username or password');
        setTimeout(() => showLogin(), 1500);
        throw new Error(res.status + ' ' + await res.text());
      }
      if (res.status !== 200) throw new Error(res.status + ' ' + await res.text());
      
      const user = await res.json();
      
      return {
        token: res.headers.get('x-auth-token'),
        user,
      };
    })
    .then(
      result => {
        document.cookie = `token=${result.token};`
        document.cookie = `username=${result.user.username};`;
        console.log(document.cookie)
        document.location.reload(false);
      },
      error => {
        console.log(error)
      }
    );

    username = null;
    password = null;
}