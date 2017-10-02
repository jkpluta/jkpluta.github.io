var base_url = "https://jkpluta.github.io";
function start(sel, spnr, href, func) {
  if (spnr != null)
      $(spnr).html('<img src="../img/spinner.gif">');
  $.ajax({
      url: base_url + href,
      cache: false,
      success: function (html) {
          $(spnr).html('');
          func(sel, html);
      },
      error: function (xhr, status, error) {
          if (spnr != null)
              $(spnr).html('<img src="../img/error.png"> <b>' + status + '</b> <i>' + error + '</i>');
      }
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
    $.ajax({
        url: href,
        dataType: "json",
        method: "GET",
        cache: false,
        success: function (html) {
            $(spnr).html('');
            func(sel, html);
        },
        error: function (xhr, status, error) {
            if (spnr != null)
                $(spnr).html('<img src="../img/error.png"> <b>' + status + '</b> <i>' + error + '</i>');
        }
    });
}
function updateMainGists(sel, data) {
    var gists = data;
    if (gists.length == 0)
        $(sel).prev().hide();
    else
        $(sel).prev().append('<div class="col-12"><h4>Zapiski</h4></div>');
    for (var idx in gists) {
        var gist = gists[idx];
        if (gist.description === 'Jan K. Pluta')
            startJson(sel, null, gist.files['bookmark.json'].raw_url, updateMainGist);
    }
}
function updateMainGist(sel, data) {
    if (data.type === "jkpluta.bookmark") {
        var link = $('<div class="col-4"><a></a></div>').appendTo($(sel)).children('a:first');
        link.attr('href', data.url);
        link.text(data.title);
        if (data.description != null)
            link.parent().after('<div class="col-8">' + data.description + '</div>');
        else
            link.parent().after('<div class="col-8"><i>Proponowana zakładka</i></div>');
    }
}
function startMain(href) {
  start('#info', '#info', '/info.html', updateMainInfo);
  start('#bks', '#bke', '/bookmarks.html', updateMainBookmarks);
  start('#icns', '#icns', '/icons.html', updateMainIcons);
  start('#icns', '#icns', '/icons.html', updateMainIcons);
  startJson('#gists', '#gsts', 'https://api.github.com/users/jkpluta/gists', updateMainGists);
  $('#google').focus();
}
$(document).ready(function() {
  startMain();
})
