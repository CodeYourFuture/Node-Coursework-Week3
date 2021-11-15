const net_layer = require('./network-layer');
module.exports = {
    validate_email,
    verify_email
}
function validate_email(email){
    let email_regex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return email_regex.test(String(email).toLowerCase());
}

async function verify_email(email,config={}){
    try{
        let network_operations = net_layer(config);
        if(!email){
            throw new Error('Please pass email address');
        }
        let is_valid_email = validate_email(email);
        if(!is_valid_email){
            throw new Error('Please pass valid email address');
        }
        const domain = email.split('@')[1];
        let  mx_records = await network_operations.dns_mx_resolver(domain);
        mx_records = mx_records.filter(record=>record.exchange);
        if(!mx_records || mx_records && !mx_records.length){
            throw new Error('mailing services are not configured for the domain');
        }
        let promises = mx_records.map(mx=>network_operations.verify_address_smtp(mx['exchange'],email));
        let response = await Promise.all(promises);
        let verified_mx_record = response.find(r=>r.is_verified);
        let un_verified_mx_record = response.find(r=>!r.is_verified);
        return response_format({
            format: true,
            is_verified: !!verified_mx_record,
            accept_all: response.every(r=>r.is_verified),
            message: verified_mx_record ? verified_mx_record.message : un_verified_mx_record.message,
            errors: !!verified_mx_record ? '' : (un_verified_mx_record ? un_verified_mx_record.errors : '')
        });
        ;
    }catch(e){
        console.log(e);
        return response_format({format:false,is_verified:false,accept_all:false,message:e.message,errors:e.message});
    }
}

function response_format(o){
    return {
        "format": o.format || false, 
        "is_verified": o.is_verified || false,
        "accept_all": o.accept_all || false,
        "message" : o.message || '',
        "errors" : o.errors || ''
    }
}