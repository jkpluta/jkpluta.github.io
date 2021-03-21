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
function updateMainInfo(sel, html) {
  $('#info').html(html);
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
                  $('#bk' + i).append('<dt><a href="' + link.attr('href') + '"><img src="' + link.attr('ICON_URI') + '" alt="" title="' + link.text() + '" width="16" height="16"> ' + link.text() + '</a></dt>');
              else
                  $('#bk' + i).append('<dt>' + link[0].outerHTML + '</dt>');
          }
      }
      $('#bk' + i).append('</dl></p>');
  }
  $(sel).find('a').attr('target', '_blank');
}
function updateMainIcons(sel, html) {
  $(sel).html('');
  var links = $('a[icon], a[icon_uri]', html);
  $(sel).append('<p>');
  for (var i = 0; i < links.length; i++) {
      var link = links.eq(i);
      if (link.attr('ICON_URI') != null)
          $(sel).append('<a href="' + link.attr('href') + '"><img src="' + link.attr('ICON_URI') + '" alt="' + link.text() + '" title="' + link.text() + '" width="32" height="32"></a> ');
      else
          $(sel).append('<a href="' + link.attr('href') + '"><img src="' + link.attr('ICON') + '" alt="' + link.text() + '" title="' + link.text() + '" width="32" height="32"></a> ');
  }
  $(sel).append('</p>');
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
function updateMainGists(sel, data) {
    var gists = data;
    var token = localStorage.getItem('token');
    if(token) {
        $(sel).prev().append('<div class="col-12"><h4>Zapiski <i id="add-gist" class="fa fa-plus"></i></h4></div>');
        $('#add-gist').click(function() {
            $('#gist-id').val('');
            $('#title').val('')
            $('#url').val('')
            $('#description').val('')
        $('.modal-title').text('Nowy zapisek')
            $('#modal').modal();
        })
    } else {
        if (gists.length == 0)
            $(sel).prev().hide();
        else
            $(sel).prev().append('<div class="col-12"><h4>Zapiski</h4></div>');
    }
    for (var idx in gists) {
        var gist = gists[idx];
        if (gist.description === 'Jan K. Pluta')
            startJson(gist, null, gist.files['bookmark.json'].raw_url, updateMainGist);
    }
}
function updateMainGist(gist, data) {
    if (data.type === "jkpluta.bookmark") {
        var item = $('<div class="col-sm-12 col-md-6 col-lg-4"></div>');
        $('#gists').append(item)
        if (data.url !== '') {
            var link = $('<a target="_blank"></a>');
            item.append(link);
            link.attr('href', data.url);
            link.text(data.title);
        } else {
            item.append('<b>' + data.title + '</b>')            
        }
        var token = localStorage.getItem('token');
        if (token) {
            $('#mnu').css('display', 'inline')
            item.append(' <i id="edit-' + gist.id + '" class="fa fa-edit"></i>')
            item.append(' <i id="del-' + gist.id + '" class="fa fa-times"></i>')
            $('#edit-' + gist.id).click(function() {
                $('#gist-id').val(gist.id)
                $('#title').val(data.title)
                $('#url').val(data.url)
                $('#description').val(data.description)
                $('.modal-title').text('Edycja zapiska')
                $('#modal').modal();
            });
            $('#del-' + gist.id).click(function() {
                if(confirm('Czy chcesz usunąć "' + data.title + '"?')) {
                    $.ajax({
                        url: 'https://api.github.com/gists/' + gist.id,
                        method: "DELETE",
                        crossDomain: true,
                        cache: false,
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader("Accept", "application/vnd.github.v3+json")
                            xhr.setRequestHeader("Authorization", "Token " + token)
                            xhr.setRequestHeader("X-GitHub-OTP", "two-factor-code")
                        },
                        success: function (data) {
                            window.location = start_url;
                        },
                        error: function (jqXHR, status, error) {
                            alert($.parseJSON(jqXHR.responseText).message)
                        }
                    });
                }
            });
        }
        if (data.description != null && data.description !== '')
            item.after('<div class="col-sm-12 col-md-6 col-lg-8">' + data.description + '</div>');
        else
            item.after('<div class="col-sm-12 col-md-6 col-lg-8"><i>Proponowana zakładka</i></div>');
    }
}
function saveGist() {
    var gistId = $('#gist-id').val();
    var page = { 
        type: 'jkpluta.bookmark', 
        title: $('#title').val(), 
        url: $('#url').val(),
        description: $('#description').val()
    };
    var data = {
        "description": "Jan K. Pluta",
        "public": true,
        "files": {
            "bookmark.json": {
                "content": JSON.stringify(page)
            }
        }
    };
    var token = localStorage.getItem('token');
    if (gistId !== '') {
        $.ajax({
            url: 'https://api.github.com/gists/' + gistId,
            method: "PATCH",
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
                window.location = start_url;
            },
            error: function (jqXHR, status, error) {
                alert($.parseJSON(jqXHR.responseText).message)
            }
        });
    } else {
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
                window.location = start_url;
            },
            error: function (jqXHR, status, error) {
                alert($.parseJSON(jqXHR.responseText).message)
            }
        });
    }
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
  start('#info', '#info', '/info.html', updateMainInfo);
  start('#icns', '#icns', '/icons.html', updateMainIcons);
  start('#bks', '#bke', '/bookmarks.html', updateMainBookmarks);
  startJson('#gists', '#gsts', 'https://api.github.com/users/jkpluta/gists', updateMainGists);
  $('#google').focus();
  $('#save').click(function() {
    saveGist();
  });
  $('#jkp').click(function() {
    startLogin();
  })
}
$(document).ready(function() {
  startMain();
})
