Transfero = {};

Transfero.Translator = function(apiKey, fromLang, toLang, options) {
    options = options || {};
    
    this.setBackend(options.backend || Transfero.Backends.Microsoft);
    
    this.setFrom(fromLang);
    this.setTo(toLang);
    
    this.apiKey   = apiKey;
    this._cbCount = 0;
};

Transfero.Translator.prototype.translate = function(input, cb, scope) {
    this.query('Translate', {
        from: this.from,
        to:   this.to,
        text: input
    }, cb, scope);
};

Transfero.Translator.prototype.detect = function(input, cb, scope) {
    this.query('Detect', {
        text: input
    }, cb, scope);
};

Transfero.Translator.prototype.speak = function(input, language, format, cb, scope) {
    this.query('Speak', {
        text:     input,
        language: this.langToCode(language),
        format:   'audio/wav'
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
    this.from = this.langToCode(from);
};

Transfero.Translator.prototype.setTo = function(to) {
    this.to = this.langToCode(to);
};

Transfero.Translator.prototype.langToCode = function(lang) {
    var code = Transfero.Languages.ISO_639_1[lang];
    return typeof code == 'string' && code.length == 2 ? code : lang;
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
        query: function(method, params, cb, scope) {
            var protocol = window.location.protocol,
                script   = document.createElement('script'),
                cbName   = this.nameCallback();
            
            if (protocol != 'https:') {
                protocol = 'http:';
            }
            
            params.appId      = this.apiKey;
            params.oncomplete = cbName;
            
            script.src = protocol + '//api.microsofttranslator.com/V2/Ajax.svc/' +
                         method + '?' + this.buildQueryString(params);
            
            window[cbName] = function(response) {
                cb.call(scope || window, response);
            };
            
            document.getElementsByTagName('head')[0].appendChild(script);
        }
    }
};

Transfero.Languages = {
    ISO_639_1: {
        'Afar':           'AA',
        'Abkhazian':      'AB',
        'Afrikaans':      'AF',
        'Amharic':        'AM',
        'Arabic':         'AR',
        'Assamese':       'AS',
        'Aymara':         'AY',
        'Azerbaijani':    'AZ',
        'Bashkir':        'BA',
        'Byelorussian':   'BE',
        'Bulgarian':      'BG',
        'Bihari':         'BH',
        'Bislama':        'BI',
        'Bengali':        'BN',
        'Bangla':         'BN',
        'Tibetan':        'BO',
        'Breton':         'BR',
        'Catalan':        'CA',
        'Corsican':       'CO',
        'Czech':          'CS',
        'Welsh':          'CY',
        'Danish':         'DA',
        'German':         'DE',
        'Bhutani':        'DZ',
        'Greek':          'EL',
        'English':        'EN',
        'American':       'EN',
        'Esperanto':      'EO',
        'Spanish':        'ES',
        'Estonian':       'ET',
        'Basque':         'EU',
        'Persian':        'FA',
        'Finnish':        'FI',
        'Fiji':           'FJ',
        'Faeroese':       'FO',
        'French':         'FR',
        'Frisian':        'FY',
        'Irish':          'GA',
        'Gaelic':         'GD',
        'Scots Gaelic':   'GD',
        'Galician':       'GL',
        'Guarani':        'GN',
        'Gujarati':       'GU',
        'Hausa':          'HA',
        'Hindi':          'HI',
        'Croatian':       'HR',
        'Hungarian':      'HU',
        'Armenian':       'HY',
        'Interlingua':    'IA',
        'Interlingue':    'IE',
        'Inupiak':        'IK',
        'Indonesian':     'IN',
        'Icelandic':      'IS',
        'Italian':        'IT',
        'Hebrew':         'IW',
        'Japanese':       'JA',
        'Yiddish':        'JI',
        'Javanese':       'JW',
        'Georgian':       'KA',
        'Kazakh':         'KK',
        'Greenlandic':    'KL',
        'Cambodian':      'KM',
        'Kannada':        'KN',
        'Korean':         'KO',
        'Kashmiri':       'KS',
        'Kurdish':        'KU',
        'Kirghiz':        'KY',
        'Latin':          'LA',
        'Lingala':        'LN',
        'Laothian':       'LO',
        'Lithuanian':     'LT',
        'Latvian':        'LV',
        'Lettish':        'LV',
        'Malagasy':       'MG',
        'Maori':          'MI',
        'Macedonian':     'MK',
        'Malayalam':      'ML',
        'Mongolian':      'MN',
        'Moldavian':      'MO',
        'Marathi':        'MR',
        'Malay':          'MS',
        'Maltese':        'MT',
        'Burmese':        'MY',
        'Nauru':          'NA',
        'Nepali':         'NE',
        'Dutch':          'NL',
        'Norwegian':      'NO',
        'Occitan':        'OC',
        'Oromo':          'OM',
        'Afan':           'OM',
        'Oriya':          'OR',
        'Punjabi':        'PA',
        'Polish':         'PL',
        'Pashto':         'PS',
        'Pushto':         'PS',
        'Portuguese':     'PT',
        'Quechua':        'QU',
        'Rhaeto-Romance': 'RM',
        'Kirundi':        'RN',
        'Romanian':       'RO',
        'Russian':        'RU',
        'Kinyarwanda':    'RW',
        'Sanskrit':       'SA',
        'Sindhi':         'SD',
        'Sangro':         'SG',
        'Serbo-Croatian': 'SH',
        'Singhalese':     'SI',
        'Slovak':         'SK',
        'Slovenian':      'SL',
        'Samoan':         'SM',
        'Shona':          'SN',
        'Somali':         'SO',
        'Albanian':       'SQ',
        'Serbian':        'SR',
        'Siswati':        'SS',
        'Sesotho':        'ST',
        'Sudanese':       'SU',
        'Swedish':        'SV',
        'Swahili':        'SW',
        'Tamil':          'TA',
        'Tegulu':         'TE',
        'Tajik':          'TG',
        'Thai':           'TH',
        'Tigrinya':       'TI',
        'Turkmen':        'TK',
        'Tagalog':        'TL',
        'Setswana':       'TN',
        'Tonga':          'TO',
        'Turkish':        'TR',
        'Tsonga':         'TS',
        'Tatar':          'TT',
        'Twi':            'TW',
        'Ukrainian':      'UK',
        'Urdu':           'UR',
        'Uzbek':          'UZ',
        'Vietnamese':     'VI',
        'Volapuk':        'VO',
        'Wolof':          'WO',
        'Xhosa':          'XH',
        'Yoruba':         'YO',
        'Chinese':        'ZH',
        'Zulu':           'ZU'
    }
};
