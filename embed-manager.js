window.MiniExtensionFormManager = window.MiniExtensionFormManager || new function () {
        return {
            embed: function (params) {
                var host = 'miniextensions.com';
                var form_key = params.key;
                var api_url = 'https://api.' + host + '/v1/iframe-embed/' + form_key + '.js?absoluteShareUrl=';
                var form_url = 'https://app.' + host + '/form/' + form_key;

                if (params.prePopulate) {
                    if (params.prePopulate == window.location) {
                        params.prePopulate = MiniExtensionFormManager.getQueryParams();
                    } else if (typeof(params.prePopulate) != 'object') {
                        params.prePopulate = {}
                    }

                    var esc = encodeURIComponent;
                    var form_param = Object.keys(params.prePopulate)
                        .map(function (k) {
                            return esc(k) + '=' + esc(params.prePopulate[k]);
                        }).join('&');
                }

                var script_url = api_url + form_url + (form_param ? '?' + form_param : '');

                MiniExtensionFormManager.insertFrame(form_key, script_url);
            },
            getQueryParam: function (name) {
                var val = MiniExtensionFormManager.getQueryParams()[name];
                return val === undefined ? '' : val;
            },
            getQueryParams: function () {
                var params = {}, tmp;
                var query = window.location.search.substr(1);

                if (query) {
                    query = query.split("&");
                    for (var i = 0; i < query.length; i++) {
                        tmp = query[i].split("=");
                        params[tmp[0]] = tmp[1];
                    }
                }

                return params;
            },
            insertFrame: function (form_key, script_url) {
                var container = document.getElementById('miniextensions-form'),
                    div = document.createElement("div"),
                    script = document.createElement("script");

                div.id = "miniextensions-iframe-embed-" + form_key;
                script.type = "text/javascript";
                script.src = script_url;

                container.parentNode.insertBefore(div, container.nextSibling);
                container.parentNode.insertBefore(script, container.nextSibling);
            }
        };
    }();