function network_layer(config = {}){ 
    const util = require('util');
    const net =  require('net');
    const dnscache = require('dnscache')({
        "enable" : true,
        "ttl" : config.ttl || 500,
        "cachesize" : config.cache_size || 1000
    });
    const resolveMxAsync = util.promisify(dnscache.resolveMx);
    function dns_mx_resolver(domain){
        return resolveMxAsync(domain); 
    }

    function verify_address_smtp(mx_record,email){
        return new Promise((resolve,reject)=>{
            let verify_response = {
                is_verified:false,
                message:'',
                errors:[],
            };
            let client = net.createConnection(25,mx_record,()=>{
                client.write('HELO HI\r\n',()=>{
                    client.write('MAIL FROM: <jainajit194@gmail.com>\r\n',()=>{
                        client.write('RCPT TO: <'+ email +'>\r\n',()=>{
                            client.write('QUIT\r\n');
                            verify_response.is_verified = true;
                            verify_response.message = 'Email Verified';
                        })
                    })
                });
        
            });  
            client.on('error',(error)=>{
                client.emit('end');
                verify_response.message = error.message;
                resolve(verify_response);
            });
            client.on('close',()=>{
                resolve(verify_response)
                client.emit('end');
            });
            client.on('data',(data)=>{
                let stringified_data = data.toString();
                let command_responses = stringified_data.trim().match(/^((?!250|221|220|251|354|422|42).)*$/igm);
                command_responses = command_responses ? command_responses.filter(r=>r) : command_responses;
                if(command_responses && command_responses.length){
                    verify_response.is_verified = false;
                    verify_response.message = command_responses[0].match(/\s+[^.!?]*[.!?]/ig)[0];
                    verify_response.errors = command_responses.join('');
                }
                
            });
            client.on('timeout',()=>{
                verify_response.message = 'Connection timeout';
                resolve(verify_response);
            });
        })
    
    }
    return {
        dns_mx_resolver,
        verify_address_smtp
    }
}

module.exports = network_layer;
