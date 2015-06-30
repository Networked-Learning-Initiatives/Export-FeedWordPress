(function everything() {

  function doTheExport() {

    var $ = window.jQuery;
    var subscribedOrInactive = $('ul.subsubsub a.current').text();
    if (subscribedOrInactive.indexOf('(') !== -1) {
      subscribedOrInactive = subscribedOrInactive.substring(0, $('ul.subsubsub a.current').text().indexOf('(')).trim();
    }

    var sites = {};
    var motherBlogTitle = $('#wp-admin-bar-site-name>a').text();
    var downloadTitle = motherBlogTitle + '-' + subscribedOrInactive + '-site-subscriptions.opml';

    $('table.widefat tr').each(function (x, item) {
      var siteTitle = $(item).find('td:nth-child(2) strong a').text();
      var siteURL = $(item).find('td:nth-child(3) a').attr('href');
      sites[siteURL] = siteTitle;
    });

    function outlineFor(title, url) {
      return '\t\t<outline text="' + title + '" title="' + title + '" type="rss" xmlUrl="' + url + '" />\n';
    }

    var output = '<?xml version="1.0" encoding="UTF-8"?>\n<opml version="1.0">\n\t<head><title>' + motherBlogTitle + '</title></head>\n\t<body>\n';
    var outputSuffix = '\t</body>\n</opml>';
    Object.keys(sites).forEach(function (url) {
      var title = sites[url];
      if (title.trim().length > 0) {
        output += outlineFor(title, url);
      }
    });
    output += outputSuffix;

    /* with many thanks to: http://stackoverflow.com/a/18197511/1449799 */
    function download(filename, text) {
      var pom = document.createElement('a');
      pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
      pom.setAttribute('download', filename);

      if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
      } else {
        pom.click();
      }
    }
    download(downloadTitle, output);
  }

  if (!window.jQuery) {
    var script = document.createElement("script");
    script.src = "//code.jquery.com/jquery-1.11.3.min.js";
    document.head.appendChild(script);

    $.ready(function () {
      console.log('jquery ready');
      doTheExport();
    });
  } else {
    console.log('already had jquery');
    doTheExport();
  }
})();