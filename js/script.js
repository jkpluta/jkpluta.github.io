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
  var listy = $('dl', html)
  for (var i = 0; i < listy.length; i++) {
    $('#bks').append('<div id="bk' + i + '" class="col-sm-6 col-md-4 col-lg-3"></div>')

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
  $('a').draggable({
    revert: true
  })
  //$('a').parent().css('border-style', 'solid').css('border-color', 'red')
  //$('a').parent().parent().css('border-style', 'solid').css('border-color', 'green')

  $('a').parent().droppable({
    accept: 'a',
    greedy: true,
    drop: handleDrop
  })
  $('a').parent().parent().droppable({
    accept: 'a',
    greedy: true,
    drop: handleDrop2
  })
}

function handleDrop( event, ui ) {
  //ui.draggable.parent().insertBefore($(this))
  $(this).before(ui.draggable.parent())
  ui.draggable.draggable('option', 'revert', false)
  ui.draggable.css('left', '')
  ui.draggable.css('top', '')
}

function handleDrop2( event, ui ) {
  $(this).children().last().before(ui.draggable.parent())
  ui.draggable.draggable('option', 'revert', false)
  ui.draggable.css('left', '')
  ui.draggable.css('top', '')
}

function pobierzInformacje(sel, url) {
  $(sel).html('<img src="./img/spinner.gif">')
  $.ajax({
    url: url,
    cache: false,
    success: function(html) {
      wczytajInformacje(sel, html)
    },
    error: function(xhr, status, error) {
      $(sel).html('<img src="./img/error.png"> <b>' + status + '</b> <i>' + error + "</i>")
    }
  })
}

function wczytajInformacje(sel, html) {
  $('#info').html(html)
}

$(document).ready(function() {
  pobierzInformacje('#info', 'https://jkpluta.github.io/info.html')
  pobierzZakładki('#bke', 'https://jkpluta.github.io/bookmarks.html')
})
