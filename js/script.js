runAjax = function(sel, href) {
  $(sel).html('<img src="./img/spinner.gif">')
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
  $(sel).html($('dt', html))
}

$(document).ready(function() {
  runAjax('#bk1', 'https://jkpluta.github.io/bookmarks.html')
})
