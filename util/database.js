const {Client}=require('pg');
const client=new Client({
    user: "postgres",
    database: 'sms_db',
    host: 'localhost',
    port:5432,
    password: 'pallav@1403'
});
client.connect().then(res=>{
    console.log('postgres connected');
}).catch(err=>{
    console.log('err while connecting to database :',err);
})
module.exports=client;