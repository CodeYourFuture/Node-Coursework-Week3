# email-syntax
Email addresses syntax validations library

[![Build Status](https://travis-ci.org/agroupp/email-syntax.svg?branch=master)](https://travis-ci.org/agroupp/email-syntax)
[![Coverage Status](https://coveralls.io/repos/github/agroupp/email-syntax/badge.svg?branch=master)](https://coveralls.io/github/agroupp/email-syntax?branch=master)

Syntax email addresses verification based on [RFC5321](https://tools.ietf.org/html/rfc5321) and 
[RFC5322](https://tools.ietf.org/html/rfc5322). Version 2 is full remake of original one using TypeScript. 
Now it's a class with one static method "validate". Library can be used in Node.js back-end and in Angular 4
front-end projects.


## Installation
Install Email Syntax as an npm module and save it to your package.json file as a dependency:
    
    npm install --save email-syntax


## Usage
Usage of validator is simple as 2 + 2. You need to import class and then use its "validate()" method.

### Node.js


```javascript
    const EmailSyntax = require('email-syntax').EmailSyntax;

    if (EmailSyntax.validate('test@some-mail.com')){
        console.log('This address is valid');
    }
```

On server environment you can use additional methods:
* split(address) - Splits email address to local part and domain name
* extractFromQuotes(localPart) - Checks if quoted and extracts local part
* validateDomainName(domainName) - Validates domain name syntaxis
* validateLocalPart(localPart) - Validates local-part of address
* isValidIpAddress(domainName) - Checks if domain name is a valid ip address like 1.2.3.4




### Angular 2/4

```typescript
    import { EmailSyntax } from 'email-syntax';

    function isEmailValid(address): boolean{
        return EmailSyntax.validate(address);
    }

```

## Tests

    npm test

