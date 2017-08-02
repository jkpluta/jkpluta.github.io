function startAjax(sel, spnr, base, href, func) {
  $(spnr).html('<img src="./img/spinner.gif">')
  $.ajax({
    url: base + href,
    cache: false,
    success: function(html) {
      $(spnr).html('')
      func(sel, base, html)
    },
    error: function(xhr, status, error) {
      $(spnr).html('<img src="./img/error.png"> <b>' + status + '</b> <i>' + error + "</i>")
    }
  })
}

function updateBookmarks(sel, base, html) {
  $(sel).html('')
  var listy = $('dl', html)
  for (var i = 0; i < listy.length; i++) {
    $(sel).append('<div id="bk' + i + '" class="col-sm-6 col-md-4 col-lg-3"></div>')

    var bieżąca_lista = listy.eq(i)
    var bieżące_pozycje = bieżąca_lista.children('dt')

    $('#bk' + i).append('<h4>' + bieżąca_lista.prev().html() + '</h4>')
    $('#bk' + i).append('<p><dl>')

    for (var j = 0; j < bieżące_pozycje.length; j++) {

      var bieżąca_pozycja = bieżące_pozycje.eq(j)
      var bieżące_linki = bieżąca_pozycja.children('a')
      
      if (bieżące_linki.length > 0) {
        var bieżący_link = bieżące_linki.first()
        $('#bk' + i).append('<dt>' + bieżący_link[0].outerHTML + '</dt>')
      }

    }

    $('#bk' + i).append('</dl></p>')
  }
}

function updateIcons(sel, base, html) {
  $(sel).html('')
  var links = $('a[icon], a[icon_uri]', html)
  $(sel).append('<p>')
  for (var i = 0; i < links.length; i++) {
    var link = links.eq(i)
    if (link.attr('ICON_URI') != null)
      $(sel).append('<a href="' + link.attr('href') + '"><img src="' + link.attr('ICON_URI') + '" alt="' + link.text() + '" title="' + link.text() + '" width="32" height="32"></a> ')
    else
      $(sel).append('<a href="' + link.attr('href') + '"><img src="' + link.attr('ICON') + '" alt="' + link.text() + '" title="' + link.text() + '" width="32" height="32"></a> ')
  }
  $(sel).append('</p>')
}

function updateInfo(sel, base, html) {
  $('#info').html(html)
}

$(document).ready(function() {
  startAjax('#info', '#info', 'https://jkpluta.github.io', '/info.html', updateInfo)
  startAjax('#icns', '#icns', 'https://jkpluta.github.io', '/icons.html', updateIcons)
  startAjax('#bks', '#bke', 'https://jkpluta.github.io', '/bookmarks.html', updateBookmarks)
})
