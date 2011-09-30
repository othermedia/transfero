Transfero = {};

Transfero.Translator = function(apiKey, fromLang, toLang, options) {
    options = options || {};
    
    this.setBackend(options.backend || this.constructor.defaultBackend);
    
    this.setFrom(fromLang);
    this.setTo(toLang);
    
    this.apiKey   = apiKey;
    this._cbCount = 0;
};

Transfero.Translator.prototype.translate = function(input, cb, scope) {
    this.query('translate', {
        from: this.fromCode,
        to:   this.toCode,
        text: input
    }, cb, scope);
};

Transfero.Translator.prototype.detect = function(input, cb, scope) {
    this.query('detect', {
        text: input
    }, cb, scope);
};

Transfero.Translator.prototype.speak = function(input, language, format, cb, scope) {
    this.query('speak', {
        text:     input,
        language: this.langToCode(language),
        format:   format || 'audio/wav'
    }, cb, scope);
};

Transfero.Translator.prototype.buildQueryString = function(params) {
    var keyValuePairs = [], key;
    
    for (key in params) {
        keyValuePairs.push(key + "=" + params[key]);
    }
    
    return keyValuePairs.join("&");
};

Transfero.Translator.prototype.nameCallback = function() {
    this._cbCount += 1;
    return '__transferoCallback_' + this._cbCount;
};

Transfero.Translator.prototype.setFrom = function(from) {
    this.fromCode = this.langToCode(from);
    
    if (this.fromCode) {
        this.from = from;
    }
};

Transfero.Translator.prototype.setTo = function(to) {
    this.toCode = this.langToCode(to);
    
    if (this.toCode) {
        this.to = to;
    }
};

Transfero.Translator.prototype.langToCode = function(lang) {
    var code = Transfero.Languages.ISO_639_1[lang];
    return typeof code == 'string' ? code : null;
};

Transfero.Translator.prototype.setBackend = function(backend) {
    var methods = ['query'],
        len     = methods.length,
        i, p;
    
    for (i = 0; i < len; i++) {
        p = methods[i];
        if (backend.hasOwnProperty(p)) {
            this[p] = backend[p];
        }
    }
};

Transfero.Backends = {
    Microsoft: {
        query: function(action, params, cb, scope) {
                action   = action.charAt(0).toUpperCase() + action.slice(1);
            var protocol = window.location.protocol,
                script   = document.createElement('script'),
                cbName   = this.nameCallback();
            
            if (protocol != 'https:') {
                protocol = 'http:';
            }
            
            params.appId      = this.apiKey;
            params.oncomplete = cbName;
            
            script.src = protocol + '//api.microsofttranslator.com/V2/Ajax.svc/' +
                         action + '?' + this.buildQueryString(params);
            
            window[cbName] = function(response) {
                cb.call(scope || window, response);
            };
            
            document.getElementsByTagName('head')[0].appendChild(script);
        }
    }
};

Transfero.Translator.defaultBackend = Transfero.Backends.Microsoft;
