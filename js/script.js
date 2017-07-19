function pobierzZakładki(sel, url) {
  // $(sel).html('<img src="./img/spinner.gif">')
  $.ajax({
    url: url,
    cache: false,
    success: function(html) {
      wczytajZakładki(sel, html)
    },
    error: function(xhr, status, error) {
      $(sel).html('<img src="./img/error.png"> <b>' + status + '</b> <i>' + error + "</i>")
    }
  })
}

function wczytajZakładki(sel, html) {
  var listy = $('dl', html)
  for(var i = 0; i < listy.length; i++) {
    var bieżąca_lista = listy.eq(i)
    var bieżące_pozycje = bieżąca_lista.children('dt')

    $('#bk' + i % 4).append('<h4>' + bieżąca_lista.prev().html() + '</h4>')
    $('#bk' + i % 4).append('<p><dl>')

    for(var j = 0; j < bieżące_pozycje.length; j++) {

      var bieżąca_pozycja = bieżące_pozycje.eq(j)
      var bieżący_link = bieżąca_pozycja.children().first()

      if (bieżący_link.prop('tagName') == 'A') {
        $('#bk' + i % 4).append('<dt>' + bieżący_link[0].outerHTML + '</dt>')
      }

    }

    $('#bk' + i % 4).append('</dl></p>')

  }
}

$(document).ready(function() {
  pobierzZakładki('#bk1', 'https://jkpluta.github.io/bookmarks.html')
})
