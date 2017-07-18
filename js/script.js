runAjax = function(sel, href) {
  // $(sel).html('<img src="./img/spinner.gif">')
  $.ajax({
    url: href,
    cache: false,
    success: function(html) {
      updateAjax(sel, html)
    },
    error: function(xhr, status, error) {
      $(sel).html('<img src="./img/error.png"> <b>' + status + '</b> <i>' + error + "</i>")
    }
  })
}

updateAjax = function(sel, html) {
  $('dl', html).each(function(idx) {
    //$('#bk' + idx % 4).append($('dl', html).eq(idx).prev().prop("tagName"))
    $('#bk' + idx % 4).append('<h4>' + $('dl', html).eq(idx).prev().html() + '</h4>')
    //$('#bk' + idx % 4).append($('dl', html).eq(idx).prev())
    //$('#bk' + idx % 4).append($('dl', html).eq(idx))

    var dl = $('dl', html).eq(idx).children('dt')

    $('#bk' + idx % 4).append('<p><dl>')

    /*
    $('a', dl).each(function(jdx) {
      $('#bk' + idx % 4).append('<dt>' + $('a', dl).eq(jdx)[0].outerHTML + '</dt>')
    })
    */

    dl.each(function(jdx, dt) {
      dl.eq(jdx).children('a').each(function(kdx) {
        a = dl.eq(jdx).children('a').eq(kdx)
        $('#bk' + idx % 4).append('<dt>' + a[0].outerHTML + '</dt>')
      })
    })

    $('#bk' + idx % 4).append('</dl></p>')

  })
}

$(document).ready(function() {
  runAjax('#bk1', 'https://jkpluta.github.io/bookmarks.html')
})
