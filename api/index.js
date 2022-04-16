const express=require('express');
const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:false}))
const con=require('./connection');

app.get('/getTask',function(req,res){
  let status = req.query.status;
  let where="";
  if(status!="all"){
    where=(status=="active")?"WHERE status=0":"WHERE status=1";
  }

  con.query('SELECT * FROM task '+where+" ORDER BY id DESC",function(err,rows)     {

    if(err) {
      res.send(JSON.stringify({"data":"","message":err}));
    } else {
      res.send(JSON.stringify({"data":rows,"message":""}));
    }
  });
})
app.post('/addTask',function(req,res){
  let title=req.body.title;
  let msg="";
  if(title==""||title==undefined){
    res.send(JSON.stringify({"message":"Title tidak boleh kosong"}));
  }else{
    con.query('INSERT INTO task SET ?', req.body,function(err,rows)     {
      if(err) {
        res.send(JSON.stringify({"data":"","message":err}));
      } else {
        res.send(JSON.stringify({"data":rows,"message":""}));
      }
    });
  }
})
app.put('/updateTask',function(req,res){
  con.query('UPDATE task SET ? WHERE id = ' + req.query.id, req.body,function(err,rows)     {
    if(err) {
      res.send(JSON.stringify({"data":"","message":err}));
    } else {
      res.send(JSON.stringify({"data":rows,"message":""}));
    }
  });
})
app.put('/completedTask',function(req,res){
  let message=[];
  let success=true;
  req.body.data.forEach(function(val){
    con.query('UPDATE task SET ? WHERE id = ' + val, {"status":1},function(err,rows)     {
      if(err) {
        message.push(err);
        success=false;
      }
    });
  })
  if(success){
    res.send(JSON.stringify({"data":"Data berhasil diupdate","message":""}));
  }else{
    res.send(JSON.stringify({"data":"","message":message}));
  }
})
app.delete('/clearComplite',function(req,res){

  con.query('DELETE FROM task WHERE status =1 ',function(err,rows)     {
    if(err) {
      res.send(JSON.stringify({"data":"","message":err}));
    } else {
      res.send(JSON.stringify({"data":rows,"message":""}));
    }
  });
})
export default{
	path:'/api',
	handler:app
}