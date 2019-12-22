/**
 * Web application
 */
const apiUrl = 'https://522b0c7f.eu-gb.apigw.appdomain.cloud/soryong';
const watch = {
  // retrieve the existing watch entries
  get() {
    return $.ajax({
      type: 'GET',
      url: `${apiUrl}/watch`,
      dataType: 'json'
    });
  },
  // add a single watch entry  
  add(name, type, seasons, platform, rating, comment, date, user) {
    console.log('Sending', name, type, seasons, platform, rating, comment, date, user)
    return $.ajax({
      type: 'PUT',
      url: `${apiUrl}/watch`,
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({
        name,
        type,
        seasons,
        platform,
        rating,
        comment,
        date,
        user
      }),
      dataType: 'json',
    });
  },

  delete(id, rev) {
    console.log('Deleting', id, rev)
    var settings = {
      "url": "https://522b0c7f.eu-gb.apigw.appdomain.cloud/soryong/watch?id=" + id + "&rev=" + rev,
      "method": "DELETE",
      "timeout": 0,
    };
    return $.ajax(settings).done(function (response) {
      console.log(response);
    });
    // return $.ajax({
    //   type: 'DELETE',
    //   url: `${apiUrl}/watch`,
    //   dataType: 'json',
    //   data: JSON.stringify({
    //     id,
    //     rev
    //   }),
    //   dataType: 'json',
    // });
  }
};

(function () {

    let watchTemplate;

    function prepareTemplates() {
      watchTemplate = Handlebars.compile($('#watch-template').html());
    }

    // retrieve entries and update the UI
    function loadwatch() {
      console.log('Loading watch...');
      $('#watch').html('Loading watch...');
      watch.get().done(function (result) {
        if (!result.items) {
          return;
        }

        const context = {
          items: result.items
        }
        $('#watch').html(watchTemplate(context));
        filterTable();
      }).error(function (error) {
        $('#watch').html('No watch');
        console.log(error);
      });
    }

    // intercept the click on the submit button, add the watch entry and
    // reload entries on success
    $(document).on('submit', '#addWatch', function (e) {
      e.preventDefault();
      date = new Date();
      nDate = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
      watch.add(
        $('#name').val(),
        $('#type').val(),
        $('#seasons').val(),
        $('#platform').val(),
        $('#rating').val(),
        $('#comment').val(),
        nDate,
        document.getElementById('usernameEmpty').value
      ).done(function (result) {
        // reload entries
        loadwatch();
      }).error(function (error) {
        console.log(error);
      });
    });

    $(document).ready(function () {
      prepareTemplates();
      loadwatch();
    });
  }

)();

function setCookie(cname, cvalue, exdays) {
  delCookie(cname);
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function delCookie(cname) {
  document.cookie = cname + "=;" + "-1";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function checkCookie() {
  var user = getCookie("username");
  if (user != "") {
    alert("Welcome again " + user);
  } else {
    user = prompt("Please enter your name:", "");
    if (user != "" && user != null) {
      setCookie("username", user, 365);
    }
  }
}

function deleteUser() {
  document.getElementById('usernameFilled').style.display = 'none';
  document.getElementById('usernameEmpty').style.display = 'block';
}

function setUser(ele) {
  if (event.key === 'Enter') {
    document.getElementById('usernameFilled').innerHTML = document.getElementById('usernameEmpty').value;
    document.getElementById('usernameFilled').style.display = 'block';
    document.getElementById('usernameEmpty').style.display = 'none';
    setCookie('username', document.getElementById('usernameFilled').innerHTML, 365)
    filterTable();
  }
}

function filterTable(filterType, column) {
  // Declare variables
  var filter, table, tr, td, i, txtValue;
  filter = document.getElementById("usernameEmpty").value;
  table = document.getElementById("watchTable");
  tr = table.getElementsByTagName("tr");
  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td");
    if (td.length >= 7) {
      txtValue = td[7].innerText;
      txtValue = txtValue.trim();
      if (txtValue == filter) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

function setRating(rating) {
  document.getElementById('rating').value = rating;
}

function deleteRow(row) {
  console.log(row)
  watch.delete(row.slot, row.title).done(function (result) {
    document.getElementById(row.slot).style.display = "none";
  }).error(function (error) {
    console.log(error);
  })
}