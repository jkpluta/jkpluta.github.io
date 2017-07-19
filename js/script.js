let LICZBA_KOLUMN = 4

function pobierzZakładki(sel, url) {
  $(sel).html('<img src="./img/spinner.gif">')
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
  $('#bks').html('')
  for(var i = 0; i < LICZBA_KOLUMN; i++) {
    $('#bks').append('<div id="bk' + i + '" class="col-lg-' + 12 / LICZBA_KOLUMN + '"></div>')
  }

  var listy = $('dl', html)
  for (var i = 0; i < listy.length; i++) {
    var bieżąca_lista = listy.eq(i)
    var bieżące_pozycje = bieżąca_lista.children('dt')

    $('#bk' + i % LICZBA_KOLUMN).append('<h4>' + bieżąca_lista.prev().html() + '</h4>')
    $('#bk' + i % LICZBA_KOLUMN).append('<p><dl>')

    for (var j = 0; j < bieżące_pozycje.length; j++) {

      var bieżąca_pozycja = bieżące_pozycje.eq(j)
      var bieżące_linki = bieżąca_pozycja.children('a')
      
      if (bieżące_linki.length > 0) {
        var bieżący_link = bieżące_linki.first()
        $('#bk' + i % LICZBA_KOLUMN).append('<dt>' + bieżący_link[0].outerHTML + '</dt>')
      }

    }

    $('#bk' + i % LICZBA_KOLUMN).append('</dl></p>')

  }
}

$(document).ready(function() {
  pobierzZakładki('#bks', 'https://jkpluta.github.io/bookmarks.html')
})
