# Email verifier

This package verifies the email exists or not. It also exposes the validate format api to check the format for the email.

## Installation

Use the package manager npm to install email-verifier-node.

```
    npm install email-verifier-node
```

## Usage

It exposes two apis:- 
1. Validate format 
2. Verify Email

### Validate Format 
This Api checks the format for the email.
```
    const email_verifier = require('email-verifier-node');
    console.log(email_verifier.validate_email('random_email@gmail.com'));
    // true

```

### Verify Email 

This Api is promise based so to obtain result you have to use then/catch or async/await. Internally, this api uses validate format api.
```
    const email_verifier = require('email-verifier-node');
    email_verifier.verify_email('jain@gmail.com')
    .then( result => {
        console.log(result)
        /* { 
            "format":true,
            "is_verified":false,
            "accept_all":false,
            "message":" The email account that you tried to reach does not exist.",
            "errors":""
        } */
    })

```
Result format is like:- 

- **format** : Returns true if email format is valid otherwise false.
- **is_verified** : Returns true if email is verified and able to receive emails otherwise false.
- **accept_all** : Returns true if all the mx_records for the domain able to receive emails otherwise false.
- **message** : Returns string stating the resultant message for the call.
- **errors** : Contains the stack trace of errors in string while querying for email verification.


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)

