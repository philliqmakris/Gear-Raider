$(document).ready(function() {
  $('#submitCredentials').click(() => {
    $('#submitCredentials').hide();

    let username = $('#usernameInput').val();
    let password = $('#passInput').val();

    $('#usernameInput').val('');
    $('#passInput').val('');

    fetch('http://localhost:3000/api/users', {
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
          $('#responseMessage').text('username already registered');
          setTimeout(() => $('#submitCredentials').show(), 1500);
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
          window.location.href = "index.html";
        },
        error => {
          console.log(error)
        }
      );

      username = null;
      password = null;
  });
});