window.MiniExtensionFormManager = window.MiniExtensionFormManager || new function () {
        return {
            embed: function (params) {
                var host = 'miniextensions.com';
                var form_key = params.key;
                var api_url = 'https://api.' + host + '/v1/iframe-embed/' + form_key + '.js?absoluteShareUrl=';
                var form_url = 'https://app.' + host + '/form/' + form_key;
                var url_params = {};
                var form_param = '';

                if (params.precedenceUrlParams === undefined)
                    params.precedenceUrlParams = false;
                else if (typeof(params.precedenceUrlParams) !== "boolean")
                    params.precedenceUrlParams = false;

                if (params.precedenceUrlParams || params.prePopulate == window.location) {
                    url_params = MiniExtensionFormManager.getQueryParams();
                }

                if (typeof(params.prePopulate) != 'object') {
                    params.prePopulate = {};
                }

                if (params.precedenceUrlParams) {
                    for (var key in url_params) {
                        params.prePopulate[key] = url_params[key];
                    }
                }

                if (params.prePopulate) {
                    var esc = encodeURIComponent;
                    form_param = Object.keys(params.prePopulate)
                        .map(function (k) {
                            return esc(k) + '=' + esc(params.prePopulate[k]);
                        }).join('&');
                }

                MiniExtensionFormManager.insertFrame(form_key, (api_url + form_url + (form_param ? '?' + form_param : '')));
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
                        if ((tmp[0] + '').lastIndexOf('prefill_', 0) === 0)
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