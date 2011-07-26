Transfero
=========

Transfero provides a wrapper library around the JSONP service exposed by the
[Microsoft Translator] services. It has a provider-neutral API for which new
backends can be easily built simply by implementing a `query` method.

[Microsoft Translator]: http://msdn.microsoft.com/en-us/library/ff512423.aspx


Usage
-----

The primary class exposed by the Transfero library is `Transfero.Translator`.
To perform translations, create a new instance of this class and call methods
(primarily the `translate` method) on it.

Since translation services typically require an API key, this must be provided
to the constructor as the first argument. If you are using a backend that does
not require an API key, just pass in a dummy value.

The languages to be translated _from_ and _to_ must also be provided as the
second and third arguments respectively.

    var translator = new Transfero.Translator('myapikey', 'French', 'Spanish'),
        inputStr   = "Salut tout le monde";
    
    translator.translate(inputStr, function(translation) {
        console.log(translation);
    });

For an extended example of how this can be used in concert with a web user
interface to allow users to translate arbitrary blocks of text from one
language to another, please refer to the `test/` directory.


Adding new backends
-------------------

Out of the box, Transfero only comes with one translator backend, for the
[Microsoft Translator] services.

New translator backends must be objects with a `query` method which should
accept four parameters: the action name (`translate`, `detect` etc.); a
parameters object representing key-value pairs to be serialised; a callback;
and an object which will be the value of the `this` keyword within the callback
when it is called.

    MyTranslatorBackend = {
        query: function(action, params, callback, scope) {
            // Implementation here
        }
    };

Note that new backends do not need to wrap JSONP services or web services of
any kind; all that is required from the point of the library is that they
implement the required interface and call the callback with appropriate values.

A backend can be specified when creating a new `Translator` object, by passing
in the relevant option.

    translator = new Transfero.Translator('myapikey', 'fromlang', 'tolang', {
        backend: MyTranslatorBackend
    });

Alternatively, it can be modified dynamically by calling `setBackend`.

    translator.setBackend(MyTranslatorBackend);

To change the default backend, simply change the value of the
`Transfero.Translator.defaultBackend` property.

    Transfero.Translator.defaultBackend = MyTranslatorBackend;
