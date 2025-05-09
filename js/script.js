var base_url = "https://jkpluta.github.io";
var start_url = base_url + '/index.html';
function start(sel, spnr, href, func) {
  if (spnr != null)
      $(spnr).html('<img src="../img/spinner.gif">');
  fetch(base_url + href)
  .then(response => response.text())
  .then(html => {
    $(spnr).html('');
    func(sel, html);
  })
  .catch(error => {
    if (spnr != null)
      $(spnr).html('<img src="../img/error.png"> <b>' + error + '</b>');
  });
}
function updateMainBookmarks(sel, html) {
  $(sel).html('');
  var listy = $('dl', html);
  for (var i = 0; i < listy.length; i++) {
      $(sel).append('<div id="bk' + i + '" class="col-sm-6 col-md-4 col-lg-3"></div>');
      var bieżąca_lista = listy.eq(i);
      var bieżące_pozycje = bieżąca_lista.children('dt');
      $('#bk' + i).append('<h4>' + bieżąca_lista.prev().html() + '</h4>');
      $('#bk' + i).append('<p><dl>');
      for (var j = 0; j < bieżące_pozycje.length; j++) {
          var bieżąca_pozycja = bieżące_pozycje.eq(j);
          var bieżące_linki = bieżąca_pozycja.children('a');
          if (bieżące_linki.length > 0) {
              var link = bieżące_linki.first();
              if (link.attr('ICON_URI') != null)
                  $('#bk' + i).append('<dt class="ficon text-truncate"><a href="' + link.attr('href') + '"><img class="ficon" src="' + link.attr('ICON_URI') + '" alt="" title="' + link.text() + '"> ' + link.text() + '</a></dt>');
              else
                  $('#bk' + i).append('<dt class="ficon text-truncate">' + link[0].outerHTML + '</dt>');
          }
      }
      $('#bk' + i).append('</dl></p>');
  }
  $(sel).find('a').attr('target', '_blank');
}
function updateMainIcons(sel, html) {
  $(sel).html('');
  var links = $('a[icon], a[icon_uri]', html);
  for (var i = 0; i < links.length; i++) {
      var link = links.eq(i);
      if (link.attr('ICON_URI') != null)
          $(sel).append('<a href="' + link.attr('href') + '"><img class="sicon" src="' + link.attr('ICON_URI') + '" alt="' + link.text() + '" title="' + link.text() + '"></a> ');
      else
          $(sel).append('<a href="' + link.attr('href') + '"><img class="sicon" src="' + link.attr('ICON') + '" alt="' + link.text() + '" title="' + link.text() + '"></a> ');
  }
  $(sel).find('a').attr('target', '_blank');
}
function startJson(sel, spnr, href, func) {
    if (spnr != null)
        $(spnr).html('<img src="../img/spinner.gif">');
    fetch(href)
    .then(response => response.json())
    .then(json => {
        $(spnr).html('');
        func(sel, json);
    })
    .catch(error => {
        if (spnr != null)
            $(spnr).html('<img src="../img/error.png"> <b>' + error + '</b>');
    });
}
function xor(source1, source2) {
    while (source2.length < source1.length) source2 = source2 + source2;
    var target = '';
    for(i = 0; i < source1.length / 2; i++) {
        var val1 = parseInt(source1.substr(i * 2, 2), 16);
        var val2 = parseInt(source2.substr(i * 2, 2), 16);
        var val = val1 ^ val2;
        var hex = val.toString(16);
        if (hex.length < 2) hex = '0' + hex;
        target += hex;
    }
    return target;
}
function toHex(source) {
    var target = '';
    for(var i = 0 ; i < source.length; i++) {
        var hex = source.charCodeAt(i).toString(16);
        if (hex.length < 2) hex = '0' + hex;
        target += hex;
    }
    return target;
}
function startLogin(href) {
    $('#create').click(function() {
        var password = toHex($('#password').val());
        var secret = $('#secret').val();
        var token = xor(secret, password);
        $('#token').val(token);
        localStorage.removeItem('token')
        var page = { 
            type: 'jkpluta.login',
            date: Date.now()
        };
        var data = {
            "description": "Jan K. Pluta",
            "public": false,
            "files": {
                "login.json": {
                    "content": JSON.stringify(page)
                }
            }
        };
        $.ajax({
            url: 'https://api.github.com/gists',
            method: "POST",
            dataType: "json",
            crossDomain: true,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data),
            cache: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Accept", "application/vnd.github.v3+json")
                xhr.setRequestHeader("Authorization", "Token " + token)
                xhr.setRequestHeader("X-GitHub-OTP", "two-factor-code")
            },
            success: function (data) {
                localStorage.setItem('token', token)
                $('#login').modal('hide')
            },
            error: function (jqXHR, status, error) {
                alert($.parseJSON(jqXHR.responseText).message)
            }
        });
    });
    $.ajax({
        url: base_url + '/json/token.json',
        method: 'GET',
        cache: false,
        success: function (data) {
            $('#secret').val(data.secret)
        }
    });
    $('#login').on('hidden.bs.modal', function () {
        window.location = start_url;
    });

    $('#login').modal();
    $('#token').val(localStorage.getItem('token'));
}
function startMain(href) {
  start('#icns', '#icns', '/icons.html', updateMainIcons);
  start('#bks', '#bke', '/bookmarks.html', updateMainBookmarks);
  $('#google').focus();
}
$(document).ready(function() {
  startMain();
})
